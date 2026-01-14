import React from 'react';
import { useInvoices } from './InvoiceContext';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const ExportCSV = () => {
  const { invoices, calculateStatus, calculateDays } = useInvoices();
  
  const exportToCSV = () => {
    // Prepare CSV data
    const csvData = invoices.map(invoice => {
      const status = calculateStatus(invoice);
      const daysInfo = calculateDays(invoice);
      
      let daysDisplay = '';
      if (daysInfo.type === 'paid') {
        if (daysInfo.days < 0) {
          daysDisplay = `Paid ${Math.abs(daysInfo.days)} days early`;
        } else if (daysInfo.days > 0) {
          daysDisplay = `Paid ${daysInfo.days} days late`;
        } else {
          daysDisplay = 'Paid on time';
        }
      } else if (daysInfo.type === 'overdue') {
        daysDisplay = `Overdue by ${daysInfo.days} days`;
      } else {
        daysDisplay = `Due in ${daysInfo.days} days`;
      }
      
      return {
        'Invoice Number': invoice.invoiceNumber,
        'Customer Name': invoice.customerName,
        'Invoice Date': new Date(invoice.invoiceDate).toLocaleDateString(),
        'Due Date': new Date(invoice.dueDate).toLocaleDateString(),
        'Amount': invoice.amount,
        'Status': status,
        'Days': daysDisplay,
        'Payment Terms': `${invoice.paymentTerms} days`,
        'Payment Date': invoice.paymentDate ? new Date(invoice.paymentDate).toLocaleDateString() : '',
      };
    });
    
    // Convert to CSV
    const headers = Object.keys(csvData[0]);
    const csvRows = [
      headers.join(','),
      ...csvData.map(row =>
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      ),
    ];
    
    const csvContent = csvRows.join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `invoices_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <button
      onClick={exportToCSV}
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
      Export to CSV
    </button>
  );
};

export default ExportCSV;

