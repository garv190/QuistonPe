import React from 'react';

const SummaryCard = ({ title, value, subtitle, icon: Icon }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {typeof value === 'number' ? (
              `Rs ${value.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
            ) : (
              value
            )}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;


