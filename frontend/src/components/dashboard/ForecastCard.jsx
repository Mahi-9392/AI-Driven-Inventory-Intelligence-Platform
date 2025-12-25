import { RISK_LEVELS } from '../../config/constants';
import { Link } from 'react-router-dom';

const ForecastCard = ({ forecast }) => {
  const riskConfig = RISK_LEVELS[forecast.riskLevel] || RISK_LEVELS.MEDIUM;
  const deficit = forecast.predictedDemand - forecast.currentStock;
  const hasDeficit = deficit > 0;

  return (
    <Link to="/forecasts" className="block">
      <div className={`card card-interactive border-l-4 ${
        forecast.riskLevel === 'HIGH' ? 'border-l-red-500' :
        forecast.riskLevel === 'MEDIUM' ? 'border-l-amber-500' : 'border-l-emerald-500'
      }`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 truncate">{forecast.productName}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{forecast.region}</p>
          </div>
          <div className={`badge ${
            forecast.riskLevel === 'HIGH' ? 'badge-high' :
            forecast.riskLevel === 'MEDIUM' ? 'badge-medium' : 'badge-low'
          }`}>
            {forecast.riskLevel}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-0.5">Demand</p>
            <p className="text-base font-semibold text-gray-900">
              {forecast.predictedDemand.toFixed(0)}
            </p>
          </div>
          <div className={`p-2 rounded-lg ${hasDeficit ? 'bg-red-50' : 'bg-gray-50'}`}>
            <p className="text-xs text-gray-500 mb-0.5">Stock</p>
            <p className={`text-base font-semibold ${hasDeficit ? 'text-red-600' : 'text-gray-900'}`}>
              {forecast.currentStock}
            </p>
          </div>
        </div>

        {hasDeficit && (
          <div className="mb-4 p-2 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-xs font-semibold text-red-800">Shortage: {deficit.toFixed(0)} units</span>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-700 mb-1.5">AI Insight</p>
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {forecast.reasoning}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-900">{forecast.recommendedAction}</p>
        </div>
      </div>
    </Link>
  );
};

export default ForecastCard;

