import React, { useState, useMemo, useCallback } from 'react';
import { useInvoices } from './InvoiceContext';
import InvoiceCard from './InvoiceCard';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const InvoiceList = () => {
  const { invoices } = useInvoices();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  
  
  const { calculateStatus } = useInvoices();
  

  const filteredAndSortedInvoices = useMemo(() => {
    let filtered = invoices.filter(invoice => {
      const matchesSearch = 
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      
      if (statusFilter !== 'All') {
        const status = calculateStatus(invoice);
        if (status !== statusFilter) return false;
      }
      
      return true;
    });
    

    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'date':
          
          comparison = new Date(a.invoiceDate) - new Date(b.invoiceDate);
          break;
        case 'dueDate':
          comparison = new Date(a.dueDate) - new Date(b.dueDate);
          break;
        default:
          
          comparison = new Date(a.invoiceDate) - new Date(b.invoiceDate);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [invoices, searchTerm, statusFilter, sortBy, sortOrder, calculateStatus]);
  

  const totalPages = Math.ceil(filteredAndSortedInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInvoices = filteredAndSortedInvoices.slice(startIndex, endIndex);
  
  const handleStatusFilterChange = useCallback((newFilter) => {
    setStatusFilter(newFilter);
    setCurrentPage(1);
  }, []);
  
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);
  
  return (
    <div>
     
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by invoice number or customer name..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
         
          <div className="flex items-center gap-2">
            
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="block px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          
          
          <div className="flex items-center gap-2">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
                setCurrentPage(1);
              }}
              className="block px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Amount: High to Low</option>
              <option value="amount-asc">Amount: Low to High</option>
              <option value="dueDate-asc">Due Date: Earliest</option>
              <option value="dueDate-desc">Due Date: Latest</option>
            </select>
          </div>
        </div>
      </div>
      
      
      {paginatedInvoices.length > 0 ? (
        <div className="space-y-5">
          {paginatedInvoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || statusFilter !== 'All' ? 'No invoices found matching your criteria.' : 'No invoices available.'}
          </p>
        </div>
      )}
      
      
      {totalPages > 1 && (
        <div className="mt-6 pt-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
            <span className="font-medium">{Math.min(endIndex, filteredAndSortedInvoices.length)}</span> of{' '}
            <span className="font-medium">{filteredAndSortedInvoices.length}</span> results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 flex items-center">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;

