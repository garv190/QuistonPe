import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const InvoiceContext = createContext();

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoices must be used within InvoiceProvider');
  }
  return context;
};

// Helper function to calculate invoice status
const calculateStatus = (invoice) => {
  if (invoice.paymentDate) {
    return 'Paid';
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(invoice.dueDate);
  dueDate.setHours(0, 0, 0, 0);
  
  if (dueDate < today) {
    return 'Overdue';
  }
  return 'Pending';
};

// Helper function to calculate days
const calculateDays = (invoice) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(invoice.dueDate);
  dueDate.setHours(0, 0, 0, 0);
  
  if (invoice.paymentDate) {
    const paymentDate = new Date(invoice.paymentDate);
    paymentDate.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((paymentDate - dueDate) / (1000 * 60 * 60 * 24));
    return { type: 'paid', days: diffDays };
  }
  
  const diffDays = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) {
    return { type: 'overdue', days: Math.abs(diffDays) };
  }
  return { type: 'pending', days: diffDays };
};

// Generate sample invoices
const generateSampleInvoices = () => {
  const customers = ['Acme Corp', 'Tech Solutions', 'Global Industries', 'Digital Services', 'Innovation Labs', 'Future Systems', 'Smart Solutions', 'NextGen Inc', 'Cloud Services', 'Data Analytics'];
  const invoices = [];
  const today = new Date();
  
  for (let i = 1; i <= 10; i++) {
    const invoiceDate = new Date(today);
    invoiceDate.setDate(invoiceDate.getDate() - Math.floor(Math.random() * 60));
    
    const paymentTerms = [7, 15, 30, 45, 60][Math.floor(Math.random() * 5)];
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + paymentTerms);
    
    const amount = Math.floor(Math.random() * 10000) + 500;
    
    // Some invoices are paid
    let paymentDate = null;
    if (Math.random() > 0.4) {
      paymentDate = new Date(dueDate);
      paymentDate.setDate(paymentDate.getDate() + Math.floor(Math.random() * 10) - 5);
    }
    
    invoices.push({
      id: `INV-${String(i).padStart(4, '0')}`,
      invoiceNumber: `INV-${String(i).padStart(4, '0')}`,
      customerName: customers[Math.floor(Math.random() * customers.length)],
      invoiceDate: invoiceDate.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      amount: amount,
      amountPaid: paymentDate ? amount : 0,
      paymentTerms: paymentTerms,
      paymentDate: paymentDate ? paymentDate.toISOString().split('T')[0] : null,
    });
  }
  
  return invoices;
};

export const InvoiceProvider = ({ children }) => {
  const normalizeInvoice = (inv) => {
    const amount = Math.round(Number(inv.amount || 0) * 100) / 100;
    const amountPaid = inv.amountPaid != null
      ? Math.round(Number(inv.amountPaid) * 100) / 100
      : (inv.paymentDate ? amount : 0);
    return {
      ...inv,
      amount,
      amountPaid,
      paymentTerms: Number(inv.paymentTerms || 0),
    };
  };

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('invoices');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          return parsed.map(normalizeInvoice);
        }
      } catch (e) {
        console.error('Error parsing saved invoices:', e);
      }
    }
    return generateSampleInvoices();
  });

  // Save to localStorage whenever invoices change
  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  const addInvoice = useCallback((newInvoice) => {
    const invoiceDate = new Date(newInvoice.invoiceDate);
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + newInvoice.paymentTerms);
    
    const amountNum = Math.round(parseFloat(newInvoice.amount) * 100) / 100;
    const invoice = {
      id: `INV-${Date.now()}`,
      invoiceNumber: `INV-${Date.now()}`,
      customerName: newInvoice.customerName,
      invoiceDate: newInvoice.invoiceDate,
      dueDate: dueDate.toISOString().split('T')[0],
      amount: amountNum,
      amountPaid: 0,
      paymentTerms: Number(newInvoice.paymentTerms),
      paymentDate: null,
    };
    
    setInvoices(prev => [...prev, invoice]);
    return invoice;
  }, []);

  // marks invoice as paid (full payment by default) - optional paymentAmount to support partial payments
  const markAsPaid = useCallback((invoiceId, paymentDate = null, paymentAmount = null) => {
    const date = paymentDate || new Date().toISOString().split('T')[0];
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.id !== invoiceId) return inv;
        const payAmount = paymentAmount != null ? Math.round(Number(paymentAmount) * 100) / 100 : inv.amount;
        return { ...inv, paymentDate: date, amountPaid: payAmount };
      })
    );
  }, []);

  // Calculate summary statistics
  const getSummaryStats = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    let totalOutstanding = 0;
    let totalOverdue = 0;
    let totalPaidThisMonth = 0;
    const paymentDelays = [];
    
    invoices.forEach(invoice => {
      const status = calculateStatus(invoice);
      const amount = invoice.amount;
      const paid = invoice.amountPaid || 0;
      const outstanding = Math.max(0, Math.round((amount - paid) * 100) / 100);

      if (status === 'Pending' || status === 'Overdue') {
        totalOutstanding += outstanding;
      }

      if (status === 'Overdue') {
        totalOverdue += outstanding;
      }

      if (invoice.paymentDate) {
        const paymentDate = new Date(invoice.paymentDate);
        if (paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear) {
          totalPaidThisMonth += paid;
        }

        const dueDate = new Date(invoice.dueDate);
        const delay = Math.floor((paymentDate - dueDate) / (1000 * 60 * 60 * 24));
        paymentDelays.push(delay);
      }
    });
    
    const avgPaymentDelay = paymentDelays.length > 0
      ? Math.round((paymentDelays.reduce((a, b) => a + b, 0) / paymentDelays.length) * 10) / 10
      : 0;
    
    return {
      totalOutstanding,
      totalOverdue,
      totalPaidThisMonth,
      avgPaymentDelay,
    };
  }, [invoices]);

  const value = {
    invoices,
    addInvoice,
    markAsPaid,
    getSummaryStats,
    calculateStatus,
    calculateDays,
  };

  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
};

