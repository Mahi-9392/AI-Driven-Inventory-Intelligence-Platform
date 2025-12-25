import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const InventoryChart = ({ product, data, loading }) => {
  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
        <p className="text-gray-600 mt-4">Loading chart data...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.productName}</h3>
        <p className="text-gray-600">No data available for this product. Please upload CSV data.</p>
      </div>
    );
  }

  // Sort data by date
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData = {
    labels: sortedData.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Units Sold',
        data: sortedData.map(item => item.unitsSold),
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Stock Available',
        data: sortedData.map(item => item.stockAvailable),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${product.productName} - Sales & Stock Trends`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Calculate summary statistics
  const totalSold = sortedData.reduce((sum, item) => sum + item.unitsSold, 0);
  const avgSold = totalSold / sortedData.length;
  const currentStock = sortedData[sortedData.length - 1]?.stockAvailable || 0;
  const minStock = Math.min(...sortedData.map(item => item.stockAvailable));
  const maxStock = Math.max(...sortedData.map(item => item.stockAvailable));

  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{product.productName}</h3>
        <p className="text-sm text-gray-600">Historical sales and stock data</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-xs text-blue-600 mb-1">Total Units Sold</p>
          <p className="text-2xl font-bold text-blue-900">{totalSold.toFixed(0)}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-xs text-green-600 mb-1">Average Daily Sales</p>
          <p className="text-2xl font-bold text-green-900">{avgSold.toFixed(1)}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-xs text-purple-600 mb-1">Current Stock</p>
          <p className="text-2xl font-bold text-purple-900">{currentStock}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <p className="text-xs text-orange-600 mb-1">Stock Range</p>
          <p className="text-2xl font-bold text-orange-900">{minStock} - {maxStock}</p>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: '400px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default InventoryChart;

