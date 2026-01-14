import React from 'react';
import { useInvoices } from './InvoiceContext';

const InvoiceRow = ({ invoice }) => {
  const { calculateStatus, calculateDays, markAsPaid } = useInvoices();
  const status = calculateStatus(invoice);
  const daysInfo = calculateDays(invoice);
  
  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
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
        return <span className="text-green-600 dark:text-green-400">Paid {Math.abs(daysInfo.days)} days early</span>;
      } else if (daysInfo.days > 0) {
        return <span className="text-orange-600 dark:text-orange-400">Paid {daysInfo.days} days late</span>;
      } else {
        return <span className="text-green-600 dark:text-green-400">Paid on time</span>;
      }
    } else if (daysInfo.type === 'overdue') {
      return <span className="text-red-600 dark:text-red-400 font-semibold">Overdue by {daysInfo.days} days</span>;
    } else {
      return <span className="text-gray-600 dark:text-gray-400">Due in {daysInfo.days} days</span>;
    }
  };
  
  const handleMarkAsPaid = () => {
    if (window.confirm(`Mark invoice ${invoice.invoiceNumber} as paid?`)) {
      markAsPaid(invoice.id);
    }
  };
  
  return (
    <tr className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
        {invoice.invoiceNumber}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {invoice.customerName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {new Date(invoice.invoiceDate).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {new Date(invoice.dueDate).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
        Rs {invoice.amount.toLocaleString('en-IN')}
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Paid: Rs {(invoice.amountPaid || 0).toLocaleString('en-IN')}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Due: Rs {Math.max(0, (invoice.amount - (invoice.amountPaid || 0))).toLocaleString('en-IN')}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={getStatusBadge(status)}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {getDaysDisplay()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {status !== 'Paid' && (
          <button
            onClick={handleMarkAsPaid}
            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
          >
            Mark Paid
          </button>
        )}
        {status === 'Paid' && (
          <span className="text-gray-400 dark:text-gray-500">-</span>
        )}
      </td>
    </tr>
  );
};

export default InvoiceRow;


