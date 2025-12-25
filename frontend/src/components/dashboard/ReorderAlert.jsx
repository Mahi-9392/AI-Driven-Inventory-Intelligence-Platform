import { RISK_LEVELS } from '../../config/constants';
import { Link } from 'react-router-dom';

const ReorderAlert = ({ forecast }) => {
  const deficit = forecast.predictedDemand - forecast.currentStock;

  return (
    <Link to="/forecasts" className="block">
      <div className="card bg-gradient-to-br from-red-50 to-red-100/50 border-2 border-red-300 shadow-md card-hover">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-bold text-red-900">Urgent Reorder Required</h3>
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-1">{forecast.productName}</p>
            <p className="text-xs text-red-700 mb-4">{forecast.region}</p>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white/80 rounded-lg p-2 border border-red-200">
                <p className="text-xs text-red-600 mb-0.5">Demand</p>
                <p className="text-base font-bold text-red-900">{forecast.predictedDemand.toFixed(0)}</p>
              </div>
              <div className="bg-white/80 rounded-lg p-2 border border-red-200">
                <p className="text-xs text-red-600 mb-0.5">Stock</p>
                <p className="text-base font-bold text-red-900">{forecast.currentStock}</p>
              </div>
              <div className="bg-white/80 rounded-lg p-2 border border-red-200">
                <p className="text-xs text-red-600 mb-0.5">Shortfall</p>
                <p className="text-base font-bold text-red-900">{deficit.toFixed(0)}</p>
              </div>
            </div>
            
            <div className="p-3 bg-white rounded-lg border border-red-200">
              <p className="text-xs font-semibold text-gray-900 mb-1.5">Recommended Action:</p>
              <p className="text-sm text-gray-700 leading-relaxed">{forecast.recommendedAction}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ReorderAlert;

