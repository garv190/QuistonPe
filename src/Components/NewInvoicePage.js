import React, { useState } from 'react';
import { useInvoices } from './InvoiceContext';
import { useNavigate } from 'react-router-dom';

const NewInvoicePage = () => {
  const { addInvoice } = useInvoices();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: '',
    amount: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    paymentTerms: 30,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Please enter a customer name';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.invoiceDate) {
      newErrors.invoiceDate = 'Please select an invoice date';
    }
    
    if (!formData.paymentTerms) {
      newErrors.paymentTerms = 'Please select payment terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
   
    setTimeout(() => {
      addInvoice({
        customerName: formData.customerName.trim(),
        amount: parseFloat(formData.amount),
        invoiceDate: formData.invoiceDate,
        paymentTerms: parseInt(formData.paymentTerms),
      });
      
      
      setFormData({
        customerName: '',
        amount: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        paymentTerms: 30,
      });
      setErrors({});
      setIsSubmitting(false);
      
      
      navigate('/');
    }, 300);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
   
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };
  
  
  const getDueDatePreview = () => {
    if (!formData.invoiceDate || !formData.paymentTerms) return null;
    const invoiceDate = new Date(formData.invoiceDate);
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + parseInt(formData.paymentTerms));
    return dueDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Invoice</h2>
        
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Customer Name
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 border rounded-md text-sm ${
                errors.customerName
                  ? 'border-red-500 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1`}
              placeholder="Enter customer or company name"
            />
            {errors.customerName && (
              <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.customerName}</p>
            )}
          </div>
          
          
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Invoice Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">Rs</span>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                className={`w-full pl-10 pr-3.5 py-2.5 border rounded-md text-sm ${
                  errors.amount
                    ? 'border-red-500 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1`}
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.amount}</p>
            )}
          </div>
          
         
          <div>
            <label htmlFor="invoiceDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Invoice Date
            </label>
            <input
              type="date"
              id="invoiceDate"
              name="invoiceDate"
              value={formData.invoiceDate}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 border rounded-md text-sm ${
                errors.invoiceDate
                  ? 'border-red-500 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1`}
            />
            {errors.invoiceDate && (
              <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.invoiceDate}</p>
            )}
          </div>
          
          
          <div>
            <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Payment Terms
            </label>
            <select
              id="paymentTerms"
              name="paymentTerms"
              value={formData.paymentTerms}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 border rounded-md text-sm ${
                errors.paymentTerms
                  ? 'border-red-500 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1`}
            >
              <option value="7">7 days</option>
              <option value="15">15 days</option>
              <option value="30">30 days</option>
              <option value="45">45 days</option>
              <option value="60">60 days</option>
            </select>
            {errors.paymentTerms && (
              <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.paymentTerms}</p>
            )}
          </div>
          
        
          {getDueDatePreview() && (
            <div className="p-3.5 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
              <p className="text-xs font-medium text-blue-900 dark:text-blue-300 mb-0.5">Due Date</p>
              <p className="text-sm text-blue-700 dark:text-blue-400">{getDueDatePreview()}</p>
            </div>
          )}
          
          
          <div className="flex gap-3 pt-5 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewInvoicePage;

