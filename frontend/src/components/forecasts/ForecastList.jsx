import { RISK_LEVELS } from '../../config/constants';

const ForecastList = ({ forecasts, selectedForecast, onSelectForecast, loading }) => {
  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center gap-3">
          <div className="animate-pulse w-4 h-4 bg-gray-200 rounded-full"></div>
          <p className="text-sm text-gray-600">Loading forecasts...</p>
        </div>
      </div>
    );
  }

  if (forecasts.length === 0) {
    return (
      <div className="card empty-state">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">No Forecasts Yet</h3>
        <p className="text-xs text-gray-500 text-center max-w-xs">
          Generate your first forecast to see AI-powered demand predictions and insights.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-0 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="heading-3">Forecasts</h2>
        <p className="text-xs text-gray-500 mt-1">{forecasts.length} active</p>
      </div>
      <div className="divide-y divide-gray-100 max-h-[calc(100vh-16rem)] overflow-y-auto">
        {forecasts.map((forecast) => {
          const riskConfig = RISK_LEVELS[forecast.riskLevel] || RISK_LEVELS.MEDIUM;
          const isSelected = selectedForecast?._id === forecast._id;
          const deficit = forecast.predictedDemand - forecast.currentStock;
          const hasDeficit = deficit > 0;

          // Risk icon
          const riskIcon = forecast.riskLevel === 'HIGH' ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          ) : forecast.riskLevel === 'MEDIUM' ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          );

          return (
            <button
              key={forecast._id}
              onClick={() => onSelectForecast(forecast)}
              className={`w-full text-left px-6 py-4 transition-all duration-200 ${
                isSelected
                  ? 'bg-indigo-50 border-l-4 border-indigo-600'
                  : 'hover:bg-gray-50 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{forecast.productName}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{forecast.region}</div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                  forecast.riskLevel === 'HIGH' ? 'badge-high' :
                  forecast.riskLevel === 'MEDIUM' ? 'badge-medium' : 'badge-low'
                }`}>
                  <span className={riskConfig.iconColor}>{riskIcon}</span>
                  {forecast.riskLevel}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Demand</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {forecast.predictedDemand.toFixed(0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Stock</p>
                  <p className={`text-sm font-semibold ${hasDeficit ? 'text-red-600' : 'text-gray-900'}`}>
                    {forecast.currentStock}
                  </p>
                </div>
              </div>

              {hasDeficit && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="font-medium">Shortage: {deficit.toFixed(0)} units</span>
                </div>
              )}

              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      forecast.confidenceScore >= 80 ? 'bg-emerald-500' :
                      forecast.confidenceScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${forecast.confidenceScore}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  {forecast.confidenceScore.toFixed(0)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastList;

