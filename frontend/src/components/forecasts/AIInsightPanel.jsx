import { RISK_LEVELS } from '../../config/constants';

const AIInsightPanel = ({ forecast, previousForecast }) => {
  if (!forecast) {
    return (
      <div className="card bg-gradient-to-br from-gray-50 to-white border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Insight Panel</h3>
            <p className="text-sm text-gray-500">Select a forecast to view AI analysis</p>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">No forecast selected</p>
        </div>
      </div>
    );
  }

  const riskConfig = RISK_LEVELS[forecast.riskLevel] || RISK_LEVELS.MEDIUM;
  
  // Determine severity level
  let severity = 'Informational';
  let severityColor = 'text-gray-600';
  let severityBg = 'bg-gray-50';
  let severityIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  if (forecast.riskLevel === 'HIGH') {
    severity = 'Immediate Action';
    severityColor = 'text-red-700';
    severityBg = 'bg-red-50';
    severityIcon = (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    );
  } else if (forecast.riskLevel === 'MEDIUM') {
    severity = 'Attention Needed';
    severityColor = 'text-amber-700';
    severityBg = 'bg-amber-50';
    severityIcon = (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }

  // Calculate changes from previous forecast
  const demandChange = previousForecast 
    ? forecast.predictedDemand - previousForecast.predictedDemand 
    : null;
  const stockChange = previousForecast 
    ? forecast.currentStock - previousForecast.currentStock 
    : null;

  return (
    <div className="card bg-gradient-to-br from-indigo-50/50 via-white to-white border-indigo-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">AI Insight Panel</h3>
          <p className="text-sm text-gray-500">{forecast.productName} • {forecast.region}</p>
        </div>
      </div>

      {/* Severity Badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${severityBg} border ${riskConfig.borderColor} mb-6`}>
        {severityIcon}
        <span className={`text-sm font-semibold ${severityColor}`}>{severity}</span>
      </div>

      {/* Confidence Score */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Confidence Score</span>
          <span className="text-sm font-semibold text-gray-900">{forecast.confidenceScore.toFixed(1)}%</span>
        </div>
        <div className="progress-bar bg-gray-200">
          <div 
            className="progress-fill bg-indigo-600"
            style={{ width: `${forecast.confidenceScore}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1.5">
          Based on {forecast.metadata?.dataPointsUsed || 'N/A'} data points
        </p>
      </div>

      {/* What Changed Section */}
      {previousForecast && (demandChange !== 0 || stockChange !== 0) && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">What Changed</h4>
          <div className="space-y-2">
            {demandChange !== null && demandChange !== 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Predicted Demand</span>
                <div className="flex items-center gap-1.5">
                  {demandChange > 0 ? (
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                  )}
                  <span className={`text-sm font-semibold ${demandChange > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {demandChange > 0 ? '+' : ''}{demandChange.toFixed(0)} units
                  </span>
                </div>
              </div>
            )}
            {stockChange !== null && stockChange !== 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current Stock</span>
                <div className="flex items-center gap-1.5">
                  {stockChange > 0 ? (
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  )}
                  <span className={`text-sm font-semibold ${stockChange > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stockChange > 0 ? '+' : ''}{stockChange.toFixed(0)} units
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Reasoning */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">AI Reasoning</h4>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {forecast.reasoning}
          </p>
        </div>
      </div>

      {/* Recommended Action */}
      <div className={`p-4 rounded-lg border-2 ${riskConfig.borderColor} ${riskConfig.bgColor}`}>
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 w-6 h-6 rounded-full ${riskConfig.bgColor} border-2 ${riskConfig.borderColor} flex items-center justify-center mt-0.5`}>
            {forecast.riskLevel === 'HIGH' ? (
              <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            ) : forecast.riskLevel === 'MEDIUM' ? (
              <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-900 mb-1.5">Recommended Action</h4>
            <p className={`text-sm ${riskConfig.textColor} leading-relaxed`}>
              {forecast.recommendedAction}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightPanel;

