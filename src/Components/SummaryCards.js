import React, { useMemo } from 'react';
import { useInvoices } from './InvoiceContext';
import SummaryCard from './SummaryCard';


const SummaryCards = () => {
  const { getSummaryStats } = useInvoices();
  
  const stats = useMemo(() => getSummaryStats(), [getSummaryStats]);
  
  const cards = [
    {
      title: 'Total Outstanding',
      value: stats.totalOutstanding,
      subtitle: 'Pending + Overdue invoices',
      
    },
    {
      title: 'Total Overdue',
      value: stats.totalOverdue,
      subtitle: 'Overdue invoices only',
      
    },
    {
      title: 'Total Paid (This Month)',
      value: stats.totalPaidThisMonth,
      subtitle: 'Paid in current month',
     
    },
   
  ];
  
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
      {cards.map((card, index) => (
        <SummaryCard key={index} {...card} />
      ))}
    </div>
  );
};

export default SummaryCards;


