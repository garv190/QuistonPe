import React from 'react';
import { useInvoices } from './InvoiceContext';
// import { CalendarIcon, CurrencyDollarIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const InvoiceCard = ({ invoice }) => {
  const { calculateStatus, calculateDays, markAsPaid } = useInvoices();
  const status = calculateStatus(invoice);
  const daysInfo = calculateDays(invoice);
  
  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold";
    switch (status) {
      case 'Paid':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
      case 'Overdue':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`;
      case 'Pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
    }
  };
  
  const getDaysDisplay = () => {
    if (daysInfo.type === 'paid') {
      if (daysInfo.days < 0) {
        return <span className="text-green-600 dark:text-green-400 font-medium">Paid {Math.abs(daysInfo.days)} days early</span>;
      } else if (daysInfo.days > 0) {
        return <span className="text-orange-600 dark:text-orange-400 font-medium">Paid {daysInfo.days} days late</span>;
      } else {
        return <span className="text-green-600 dark:text-green-400 font-medium">Paid on time</span>;
      }
    } else if (daysInfo.type === 'overdue') {
      return <span className="text-red-600 dark:text-red-400 font-semibold">Overdue by {daysInfo.days} days</span>;
    } else {
      return <span className="text-gray-600 dark:text-gray-400 font-medium">Due in {daysInfo.days} days</span>;
    }
  };
  
  const handleMarkAsPaid = () => {
    if (window.confirm(`Mark invoice ${invoice.invoiceNumber} as paid?`)) {
      markAsPaid(invoice.id);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm p-5">
     
      <div className="flex items-start justify-between mb-5 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {invoice.invoiceNumber}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Invoice</p>
        </div>
        <span className={getStatusBadge(status)}>
          {status}
        </span>
      </div>
      
    
      <div className="mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Customer Name</p>
        <p className="text-base text-gray-900 dark:text-white font-medium">{invoice.customerName}</p>
      </div>
      
      
      <div className="mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Amount</p>
        <p className="text-xl text-gray-900 dark:text-white font-semibold">
          Rs {invoice.amount.toLocaleString('en-IN')}
        </p>
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          <div>Amount Paid: <span className="font-medium">Rs {(invoice.amountPaid || 0).toLocaleString('en-IN')}</span></div>
          <div>Amount Due: <span className="font-medium">Rs {Math.max(0, (invoice.amount - (invoice.amountPaid || 0))).toLocaleString('en-IN')}</span></div>
        </div>
      </div>
      
      
      <div className="space-y-2.5 mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Invoice Date</p>
          <p className="text-sm text-gray-900 dark:text-white">
            {new Date(invoice.invoiceDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Due Date</p>
          <p className="text-sm text-gray-900 dark:text-white">
            {new Date(invoice.dueDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        {invoice.paymentDate && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Payment Date</p>
            <p className="text-sm text-gray-900 dark:text-white">
              {new Date(invoice.paymentDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        )}
      </div>
      
      
      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Payment Terms</p>
            <p className="text-sm text-gray-900 dark:text-white">{invoice.paymentTerms} days</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Status</p>
            <div className="text-sm">
              {getDaysDisplay()}
            </div>
          </div>
        </div>
      </div>
      
      
      <div>
        {status !== 'Paid' && (
          <button
            onClick={handleMarkAsPaid}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-colors"
          >
            Mark as Paid
          </button>
        )}
        {status === 'Paid' && (
          <div className="w-full px-4 py-2 text-sm font-medium text-center text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-md">
            Payment Completed
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceCard;


