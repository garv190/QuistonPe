import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useInvoices } from './InvoiceContext';

const InvoiceChart = () => {
  const { invoices, calculateStatus } = useInvoices();
  
  const chartData = useMemo(() => {
    const counts = {
      Paid: 0,
      Pending: 0,
      Overdue: 0,
    };
    
    invoices.forEach(invoice => {
      const status = calculateStatus(invoice);
      counts[status] = (counts[status] || 0) + 1;
    });
    
    return [
      { name: 'Paid', count: counts.Paid, fill: '#10b981' },
      { name: 'Pending', count: counts.Pending, fill: '#f59e0b' },
      { name: 'Overdue', count: counts.Overdue, fill: '#ef4444' },
    ];
  }, [invoices, calculateStatus]);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Invoice Status Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280"
            tick={{ fill: '#6b7280' }}
          />
          <YAxis 
            stroke="#6b7280"
            tick={{ fill: '#6b7280' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '6px'
            }}
          />
          <Legend />
          <Bar dataKey="count" shape={(props) => {
            const { x, y, width, height, payload } = props;
            return <rect x={x} y={y} width={width} height={height} fill={payload.fill} rx={4} />;
          }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InvoiceChart;

