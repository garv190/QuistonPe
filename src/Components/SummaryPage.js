import SummaryCards from './SummaryCards';
import InvoiceChart from './InvoiceChart';
import ExportCSV from './ExportCSV';

const SummaryPage = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Invoice Summary</h2>
        </div>
        <ExportCSV />
      </div>
      
      <SummaryCards />
      
      <div className="mt-6">
        <InvoiceChart />
      </div>
    </div>
  );
};

export default SummaryPage;


