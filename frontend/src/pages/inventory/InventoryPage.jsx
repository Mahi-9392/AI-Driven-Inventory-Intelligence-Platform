import { useState, useEffect } from 'react';
import { inventoryRequest } from '../../request/inventoryRequest';
import CSVUpload from '../../components/inventory/CSVUpload';
import ProductList from '../../components/inventory/ProductList';
import InventoryChart from '../../components/inventory/InventoryChart';

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      loadInventoryData(selectedProduct._id);
    } else {
      setInventoryData([]);
    }
  }, [selectedProduct]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await inventoryRequest.getProducts();
      const productsList = response.data.products || [];
      setProducts(productsList);
      // Auto-select first product if available
      if (productsList.length > 0 && !selectedProduct) {
        setSelectedProduct(productsList[0]);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInventoryData = async (productId) => {
    try {
      setLoadingData(true);
      const response = await inventoryRequest.getInventoryData({
        productId,
        limit: 100,
      });
      setInventoryData(response.data.data || []);
    } catch (error) {
      console.error('Failed to load inventory data:', error);
      setInventoryData([]);
    } finally {
      setLoadingData(false);
    }
  };

  const handleUploadSuccess = () => {
    loadProducts();
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="heading-1">Inventory Management</h1>
        <p className="mt-2 body-text">Upload and analyze your historical sales and inventory data</p>
      </div>

      {/* CSV Upload */}
      <CSVUpload onUploadSuccess={handleUploadSuccess} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product List Sidebar */}
        <div className="lg:col-span-1">
          <ProductList
            products={products}
            selectedProduct={selectedProduct}
            onSelectProduct={setSelectedProduct}
            loading={loading}
          />
        </div>

        {/* Chart Area */}
        <div className="lg:col-span-2">
          {selectedProduct ? (
            <InventoryChart
              product={selectedProduct}
              data={inventoryData}
              loading={loadingData}
            />
          ) : (
            <div className="card empty-state">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Product</h3>
              <p className="body-text max-w-sm">
                Choose a product from the list to view detailed sales trends, stock levels, and analytics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;

