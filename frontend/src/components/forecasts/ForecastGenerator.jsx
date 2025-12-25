import { useState } from 'react';

const ForecastGenerator = ({ products, onGenerate, loading, error: parentError }) => {
  const [productId, setProductId] = useState('');
  const [region, setRegion] = useState('');
  const [generating, setGenerating] = useState(false);
  const [localError, setLocalError] = useState('');

  // Get unique regions from products
  const regions = [...new Set(
    products.flatMap(p => p.regions || [])
  )].sort();

  const selectedProduct = products.find(p => p._id === productId);
  const error = localError || parentError;

  const handleGenerate = async () => {
    if (!productId || !region) {
      setLocalError('Please select both product and region');
      return;
    }

    try {
      setGenerating(true);
      setLocalError('');
      await onGenerate(
        selectedProduct._id,
        selectedProduct.productName,
        region
      );
      setProductId('');
      setRegion('');
    } catch (err) {
      console.error('Forecast generation error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to generate forecast';
      setLocalError(errorMessage);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="card bg-gradient-to-br from-indigo-50/30 to-white border-indigo-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h2 className="heading-3">Generate New Forecast</h2>
          <p className="text-xs text-gray-500 mt-0.5">AI-powered demand prediction</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product
          </label>
          <select
            value={productId}
            onChange={(e) => {
              setProductId(e.target.value);
              setRegion('');
              setLocalError('');
            }}
            className="input-field"
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.productName}
              </option>
            ))}
          </select>
          {products.length === 0 && (
            <p className="text-xs text-gray-500 mt-1.5">
              No products available. Upload CSV data first.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Region
          </label>
          <select
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              setLocalError('');
            }}
            disabled={!productId}
            className="input-field"
          >
            <option value="">Select a region</option>
            {selectedProduct?.regions?.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {!productId && (
            <p className="text-xs text-gray-500 mt-1.5">
              Select a product to choose region
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={!productId || !region || generating || loading}
        className="btn-primary w-full md:w-auto flex items-center justify-center gap-2"
      >
        {generating ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate Forecast
          </>
        )}
      </button>
    </div>
  );
};

export default ForecastGenerator;

