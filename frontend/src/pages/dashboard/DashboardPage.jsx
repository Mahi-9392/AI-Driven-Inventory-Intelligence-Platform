import { useEffect, useState } from 'react';
import { forecastRequest } from '../../request/forecastRequest';
import InsightCard from '../../components/dashboard/InsightCard';
import ForecastCard from '../../components/dashboard/ForecastCard';
import ReorderAlert from '../../components/dashboard/ReorderAlert';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    highRisk: 0,
    mediumRisk: 0,
    lowRisk: 0,
  });

  useEffect(() => {
    loadForecasts();
  }, []);

  const loadForecasts = async () => {
    try {
      setLoading(true);
      const response = await forecastRequest.getForecasts({ limit: 10 });
      const forecastData = response.data.forecasts || [];
      setForecasts(forecastData);

      setStats({
        total: forecastData.length,
        highRisk: forecastData.filter(f => f.riskLevel === 'HIGH').length,
        mediumRisk: forecastData.filter(f => f.riskLevel === 'MEDIUM').length,
        lowRisk: forecastData.filter(f => f.riskLevel === 'LOW').length,
      });
    } catch (error) {
      console.error('Failed to load forecasts:', error);
    } finally {
      setLoading(false);
    }
  };

  const highRiskForecasts = forecasts.filter(f => f.riskLevel === 'HIGH');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="animate-spin w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="heading-1">Dashboard</h1>
        <p className="mt-2 body-text">AI-powered inventory insights and forecasts at a glance</p>
      </div>

      {/* Reorder Alerts */}
      {highRiskForecasts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="heading-3">Urgent Reorder Alerts</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {highRiskForecasts.map((forecast) => (
              <ReorderAlert key={forecast._id} forecast={forecast} />
            ))}
          </div>
        </div>
      )}

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <InsightCard
          title="Total Forecasts"
          value={stats.total}
          subtitle="Active predictions"
          color="blue"
          icon={
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        <InsightCard
          title="High Risk"
          value={stats.highRisk}
          subtitle="Requires attention"
          color="red"
          icon={
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
        <InsightCard
          title="Medium Risk"
          value={stats.mediumRisk}
          subtitle="Monitor closely"
          color="yellow"
          icon={
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <InsightCard
          title="Low Risk"
          value={stats.lowRisk}
          subtitle="Stable inventory"
          color="green"
          icon={
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Recent Forecasts */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="heading-3">Recent Forecasts</h2>
          <Link
            to="/forecasts"
            className="btn-ghost text-sm flex items-center gap-1"
          >
            View all
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        {forecasts.length === 0 ? (
          <div className="card empty-state">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Forecasts Yet</h3>
            <p className="body-text max-w-sm mb-6">
              Get started by uploading your inventory data and generating your first AI-powered forecast.
            </p>
            <Link
              to="/inventory"
              className="btn-primary inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Inventory Data
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {forecasts.map((forecast) => (
              <ForecastCard key={forecast._id} forecast={forecast} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

