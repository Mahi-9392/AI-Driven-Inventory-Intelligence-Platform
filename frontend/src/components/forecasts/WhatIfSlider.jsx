import { useState, useMemo } from 'react';
import { RISK_LEVELS } from '../../config/constants';

const WhatIfSlider = ({ forecast }) => {
  const [demandMultiplier, setDemandMultiplier] = useState(1.0);

  if (!forecast) return null;

  const adjustedDemand = Math.round(forecast.predictedDemand * demandMultiplier);
  const deficit = adjustedDemand - forecast.currentStock;
  const stockPercentage = (forecast.currentStock / adjustedDemand) * 100;

  // Calculate risk level based on adjusted demand
  const calculateRisk = () => {
    if (deficit > 0) return 'HIGH';
    if (stockPercentage < 120) return 'MEDIUM';
    return 'LOW';
  };

  const adjustedRisk = calculateRisk();
  const riskConfig = RISK_LEVELS[adjustedRisk] || RISK_LEVELS.MEDIUM;

  const recommendation = useMemo(() => {
    if (deficit > 0) {
      return `URGENT: Reorder ${Math.ceil(deficit)} units immediately. Predicted demand (${adjustedDemand}) exceeds current stock (${forecast.currentStock}).`;
    } else if (stockPercentage < 120) {
      return `Monitor closely. Consider ordering ${Math.ceil(adjustedDemand * 1.2 - forecast.currentStock)} units to maintain 20% buffer.`;
    } else {
      return `Stock levels are adequate. Current stock covers predicted demand with ${Math.round(stockPercentage - 100)}% buffer.`;
    }
  }, [adjustedDemand, forecast.currentStock, stockPercentage, deficit]);

  return (
    <div className="card bg-gradient-to-br from-purple-50/50 to-white border-purple-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">What-If Analysis</h3>
          <p className="text-xs text-gray-500">Simulate demand scenarios</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">
              Demand Adjustment
            </label>
            <span className="text-sm font-semibold text-indigo-600">
              {((demandMultiplier - 1) * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.05"
            value={demandMultiplier}
            onChange={(e) => setDemandMultiplier(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>-50%</span>
            <span>0%</span>
            <span>+50%</span>
            <span>+100%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-lg border border-gray-200">
          <div>
            <p className="text-xs text-gray-600 mb-1">Adjusted Demand</p>
            <p className="text-lg font-semibold text-gray-900">{adjustedDemand}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Stock Coverage</p>
            <p className={`text-lg font-semibold ${stockPercentage < 100 ? 'text-red-600' : 'text-emerald-600'}`}>
              {stockPercentage.toFixed(0)}%
            </p>
          </div>
        </div>

        <div className={`p-3 rounded-lg border-2 ${riskConfig.borderColor} ${riskConfig.bgColor}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`badge ${adjustedRisk === 'HIGH' ? 'badge-high' : adjustedRisk === 'MEDIUM' ? 'badge-medium' : 'badge-low'}`}>
              {adjustedRisk} Risk
            </span>
          </div>
          <p className={`text-xs ${riskConfig.textColor} leading-relaxed`}>
            {recommendation}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatIfSlider;

