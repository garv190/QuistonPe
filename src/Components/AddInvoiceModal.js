import React, { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useInvoices } from './InvoiceContext';

const AddInvoiceModal = ({ isOpen, onClose }) => {
  const { addInvoice } = useInvoices();
  const [formData, setFormData] = useState({
    customerName: '',
    amount: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    paymentTerms: 30,
  });
  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    if (!formData.invoiceDate) {
      newErrors.invoiceDate = 'Invoice date is required';
    }
    
    if (!formData.paymentTerms) {
      newErrors.paymentTerms = 'Payment terms are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    addInvoice({
      customerName: formData.customerName.trim(),
      amount: parseFloat(formData.amount),
      invoiceDate: formData.invoiceDate,
      paymentTerms: parseInt(formData.paymentTerms),
    });
    
    // Reset form
    setFormData({
      customerName: '',
      amount: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      paymentTerms: 30,
    });
    setErrors({});
    onClose();
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };
  
  // Calculate due date preview
  const getDueDatePreview = () => {
    if (!formData.invoiceDate || !formData.paymentTerms) return null;
    const invoiceDate = new Date(formData.invoiceDate);
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + parseInt(formData.paymentTerms));
    return dueDate.toLocaleDateString();
  };
  
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto max-w-lg w-full rounded-lg bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Add New Invoice
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Customer Name */}
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.customerName
                    ? 'border-red-300 dark:border-red-600'
                    : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="Enter customer name"
              />
              {errors.customerName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customerName}</p>
              )}
            </div>
            
            {/* Invoice Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Invoice Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.amount
                    ? 'border-red-300 dark:border-red-600'
                    : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount}</p>
              )}
            </div>
            
            {/* Invoice Date */}
            <div>
              <label htmlFor="invoiceDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Invoice Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="invoiceDate"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.invoiceDate
                    ? 'border-red-300 dark:border-red-600'
                    : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              />
              {errors.invoiceDate && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.invoiceDate}</p>
              )}
            </div>
            
            {/* Payment Terms */}
            <div>
              <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Payment Terms (Days) <span className="text-red-500">*</span>
              </label>
              <select
                id="paymentTerms"
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.paymentTerms
                    ? 'border-red-300 dark:border-red-600'
                    : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              >
                <option value="7">7 days</option>
                <option value="15">15 days</option>
                <option value="30">30 days</option>
                <option value="45">45 days</option>
                <option value="60">60 days</option>
              </select>
              {errors.paymentTerms && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.paymentTerms}</p>
              )}
            </div>
            
            {/* Due Date Preview */}
            {getDueDatePreview() && (
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Due Date:</span> {getDueDatePreview()}
                </p>
              </div>
            )}
            
            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Invoice
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default AddInvoiceModal;


