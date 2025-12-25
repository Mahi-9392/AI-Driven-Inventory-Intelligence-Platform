const ProductList = ({ products, selectedProduct, onSelectProduct, loading }) => {
  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center gap-3">
          <div className="animate-pulse w-4 h-4 bg-gray-200 rounded-full"></div>
          <p className="text-sm text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="card empty-state">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">No Products Found</h3>
        <p className="text-xs text-gray-500 text-center max-w-xs">
          Upload CSV data to start analyzing your inventory.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-0 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="heading-3">Products</h2>
        <p className="text-xs text-gray-500 mt-1">{products.length} available</p>
      </div>
      <div className="divide-y divide-gray-100 max-h-[calc(100vh-20rem)] overflow-y-auto">
        {products.map((product) => {
          const isSelected = selectedProduct?._id === product._id;
          return (
            <button
              key={product._id}
              onClick={() => onSelectProduct(product)}
              className={`w-full text-left px-6 py-4 transition-all duration-200 ${
                isSelected
                  ? 'bg-indigo-50 border-l-4 border-indigo-600'
                  : 'hover:bg-gray-50 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{product.productName}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-gray-500">
                      {product.regions?.length || 0} region{product.regions?.length !== 1 ? 's' : ''}
                    </span>
                    {product.lastUpdated && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-500">
                          Updated {new Date(product.lastUpdated).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;

