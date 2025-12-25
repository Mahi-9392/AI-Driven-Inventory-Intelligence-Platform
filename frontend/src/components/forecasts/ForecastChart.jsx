import { RISK_LEVELS } from '../../config/constants';

const ForecastChart = ({ forecast }) => {
  const riskConfig = RISK_LEVELS[forecast.riskLevel] || RISK_LEVELS.MEDIUM;
  const deficit = forecast.predictedDemand - forecast.currentStock;
  const stockPercentage = (forecast.currentStock / forecast.predictedDemand) * 100;

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-100">
        <div>
          <h2 className="heading-2 mb-1">{forecast.productName}</h2>
          <p className="body-text">{forecast.region}</p>
        </div>
        <div className={`badge ${forecast.riskLevel === 'HIGH' ? 'badge-high' : forecast.riskLevel === 'MEDIUM' ? 'badge-medium' : 'badge-low'}`}>
          {riskConfig.label}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-4 border border-indigo-100">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <p className="text-xs font-medium text-gray-600">Predicted Demand</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{forecast.predictedDemand.toFixed(0)}</p>
          <p className="text-xs text-gray-500 mt-1">units</p>
        </div>

        <div className={`bg-gradient-to-br ${deficit > 0 ? 'from-red-50 to-white border-red-100' : 'from-gray-50 to-white border-gray-100'} rounded-xl p-4 border`}>
          <div className="flex items-center gap-2 mb-2">
            <svg className={`w-4 h-4 ${deficit > 0 ? 'text-red-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-xs font-medium text-gray-600">Current Stock</p>
          </div>
          <p className={`text-2xl font-bold ${deficit > 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {forecast.currentStock}
          </p>
          <p className="text-xs text-gray-500 mt-1">units</p>
        </div>

        <div className={`bg-gradient-to-br ${deficit > 0 ? 'from-red-50 to-white border-red-100' : 'from-emerald-50 to-white border-emerald-100'} rounded-xl p-4 border`}>
          <div className="flex items-center gap-2 mb-2">
            {deficit > 0 ? (
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <p className="text-xs font-medium text-gray-600">Gap</p>
          </div>
          <p className={`text-2xl font-bold ${deficit > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            {deficit > 0 ? '+' : ''}{deficit.toFixed(0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">units</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-4 border border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-xs font-medium text-gray-600">Confidence</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{forecast.confidenceScore.toFixed(1)}%</p>
          <p className="text-xs text-gray-500 mt-1">score</p>
        </div>
      </div>

      {/* Stock Coverage Visualization */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-700">Stock Coverage</span>
          <span className={`text-sm font-semibold ${stockPercentage < 100 ? 'text-red-600' : 'text-emerald-600'}`}>
            {stockPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="progress-bar bg-gray-200">
          <div
            className={`progress-fill ${
              stockPercentage < 50 ? 'bg-red-500' : stockPercentage < 100 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(stockPercentage, 100)}%` }}
          />
        </div>
        {deficit > 0 && (
          <p className="text-xs text-red-600 mt-2 font-medium">
            ⚠️ Stock deficit of {deficit.toFixed(0)} units requires immediate attention
          </p>
        )}
      </div>

      {/* Analytics Summary */}
      {forecast.analytics && (
        <div className="section-divider">
          <h3 className="heading-3 mb-4">Performance Analytics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Moving Average</p>
              <p className="text-base font-semibold text-gray-900">
                {forecast.analytics.movingAverage?.toFixed(1) || 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Growth Rate</p>
              <p className={`text-base font-semibold ${forecast.analytics.growthRate >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {forecast.analytics.growthRate >= 0 ? '+' : ''}{forecast.analytics.growthRate?.toFixed(1) || 'N/A'}%
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Sales Velocity</p>
              <p className="text-base font-semibold text-gray-900">
                {forecast.analytics.salesVelocity?.toFixed(1) || 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Volatility</p>
              <p className="text-base font-semibold text-gray-900">
                {forecast.analytics.regionalVolatility?.toFixed(1) || 'N/A'}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForecastChart;

