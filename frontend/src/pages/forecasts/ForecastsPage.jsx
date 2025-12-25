import { useState, useEffect } from 'react';
import { forecastRequest } from '../../request/forecastRequest';
import { inventoryRequest } from '../../request/inventoryRequest';
import { reportRequest } from '../../request/reportRequest';
import ForecastList from '../../components/forecasts/ForecastList';
import ForecastGenerator from '../../components/forecasts/ForecastGenerator';
import ForecastChart from '../../components/forecasts/ForecastChart';
import AIInsightPanel from '../../components/forecasts/AIInsightPanel';
import WhatIfSlider from '../../components/forecasts/WhatIfSlider';

const ForecastsPage = () => {
  const [forecasts, setForecasts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedForecast, setSelectedForecast] = useState(null);
  const [previousForecast, setPreviousForecast] = useState(null);

  useEffect(() => {
    loadForecasts();
    loadProducts();
  }, []);

  useEffect(() => {
    if (selectedForecast) {
      // Find previous forecast for the same product/region
      const previous = forecasts
        .filter(f => 
          f.productId === selectedForecast.productId && 
          f.region === selectedForecast.region &&
          f._id !== selectedForecast._id
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
      setPreviousForecast(previous || null);
    }
  }, [selectedForecast, forecasts]);

  const loadForecasts = async () => {
    try {
      setLoading(true);
      const response = await forecastRequest.getForecasts({ limit: 50 });
      setForecasts(response.data.forecasts || []);
    } catch (error) {
      console.error('Failed to load forecasts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await inventoryRequest.getProducts();
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const handleGenerateForecast = async (productId, productName, region) => {
    try {
      setLoading(true);
      const response = await forecastRequest.generateForecast(productId, productName, region);
      await loadForecasts();
      // Auto-select the newly generated/updated forecast
      const updatedForecasts = await forecastRequest.getForecasts({ limit: 50 });
      const newForecast = updatedForecasts.data.forecasts?.find(
        f => f.productId === productId && f.region === region
      );
      if (newForecast) {
        setSelectedForecast(newForecast);
      }
    } catch (error) {
      console.error('Failed to generate forecast:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      const response = await reportRequest.generatePDF();
      
      if (!response.data || response.data.size === 0) {
        throw new Error('Empty PDF response from server');
      }

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inventory-report-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate report:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to generate PDF report';
      alert(`Failed to generate PDF report: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="heading-1">AI Forecasts</h1>
          <p className="mt-2 body-text">Generate and view AI-powered demand forecasts with actionable insights</p>
        </div>
        <button
          onClick={handleGenerateReport}
          disabled={loading || forecasts.length === 0}
          className="btn-secondary flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Generate PDF Report
        </button>
      </div>

      {/* Forecast Generator */}
      <ForecastGenerator
        products={products}
        onGenerate={handleGenerateForecast}
        loading={loading}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Forecast List - Left Sidebar */}
        <div className="lg:col-span-3">
          <ForecastList
            forecasts={forecasts}
            selectedForecast={selectedForecast}
            onSelectForecast={setSelectedForecast}
            loading={loading}
          />
        </div>

        {/* Center Content - Chart and Details */}
        <div className="lg:col-span-6 space-y-6">
          {selectedForecast ? (
            <>
              <ForecastChart forecast={selectedForecast} />
            </>
          ) : (
            <div className="card empty-state">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Forecast</h3>
              <p className="body-text max-w-sm">
                Choose a forecast from the list to view detailed analytics, AI insights, and recommendations.
              </p>
            </div>
          )}
        </div>

        {/* Right Sidebar - AI Insights & What-If */}
        <div className="lg:col-span-3 space-y-6">
          <AIInsightPanel forecast={selectedForecast} previousForecast={previousForecast} />
          {selectedForecast && <WhatIfSlider forecast={selectedForecast} />}
        </div>
      </div>
    </div>
  );
};

export default ForecastsPage;

