import React, { useState } from 'react';
import InvoiceList from './InvoiceList';
import AddInvoiceModal from './AddInvoiceModal';


const InvoicePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
   
      
      
      <InvoiceList />
      
      
      <AddInvoiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default InvoicePage;

