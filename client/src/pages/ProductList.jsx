import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Search, 
  RefreshCw, 
  Plus,
  List
} from 'lucide-react';
import ProductForm from './productform';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [currentView, setCurrentView] = useState('list');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const onProductAdded = () => {
      loadProducts();
      setCurrentView('list');
    };
    window.addEventListener('productAdded', onProductAdded);
    return () => window.removeEventListener('productAdded', onProductAdded);
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
      } else {
        console.error('Error fetching products:', data.message);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.modelNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(product => product.category))];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-4 rounded-full animate-spin mx-auto" style={{borderTopColor: 'rgb(7,72,94)'}}></div>
          <p className="mt-4" style={{color: 'rgb(7,72,94)'}}>
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-16 sm:pb-0">
      {/* Header with toggle */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-row justify-between items-center gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold" style={{color: 'rgb(7,72,94)'}}>
              {currentView === 'list' ? 'Product List' : 'CCTV Product Form'}
            </h1>
            {currentView === 'list' && (
              <p className="text-gray-600 mt-1">View and manage all your products ({products.length} items)</p>
            )}
          </div>
          {currentView === 'list' ? (
            <div className="hidden sm:flex gap-2">
              <button
                onClick={loadProducts}
                className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg"
                style={{ backgroundColor: 'rgb(7,72,94)', color: 'white' }}
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              <button
                onClick={() => setCurrentView('form')}
                className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg"
                style={{ backgroundColor: 'white', color: 'rgb(7,72,94)', border: '2px solid rgb(7,72,94)' }}
              >
                <Plus size={16} />
                Add Product
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCurrentView('list')}
              className="hidden sm:flex shrink-0 items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg"
              style={{ backgroundColor: 'rgb(7,72,94)', color: 'white' }}
            >
              <List size={16} />
              Show Products
            </button>
          )}
        </div>
      </motion.div>

      {/* ✅ Mobile Action Buttons moved above filter */}
      {currentView === 'list' ? (
        <div className="sm:hidden mb-4 flex gap-2 px-3">
          <button
            onClick={loadProducts}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg"
            style={{ backgroundColor: 'rgb(7,72,94)', color: 'white' }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            onClick={() => setCurrentView('form')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg"
            style={{ backgroundColor: 'white', color: 'rgb(7,72,94)', border: '2px solid rgb(7,72,94)' }}
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      ) : (
        <div className="sm:hidden mb-4 px-3">
          <button
            onClick={() => setCurrentView('list')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg"
            style={{ backgroundColor: 'rgb(7,72,94)', color: 'white' }}
          >
            <List size={16} />
            Show Products
          </button>
        </div>
      )}

      {currentView === 'form' ? (
        <ProductForm />
      ) : (
        <>
         {/* 🔎 Search & Filter Toolbar */}
<motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
  className="mb-6"
>
  <div className="flex flex-col sm:flex-row items-center gap-4 px-4 py-3 border rounded-lg bg-gray-50">
    {/* Search Box */}
    <div className="relative flex-1 w-full">
      <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
      <input
        type="text"
        placeholder="Search products, brands, or model numbers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
        style={{'--tw-ring-color': 'rgb(7,72,94)'}}
      />
    </div>

    {/* Filter Dropdown */}
    <div className="w-full sm:w-48">
      <select
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
        style={{'--tw-ring-color': 'rgb(7,72,94)'}}
      >
        <option value="">All Categories</option>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
    </div>
  </div>
</motion.div>


          {/* Products Table / Card View */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b" style={{backgroundColor: '#CDE1E6'}}>
                <h2 className="text-lg font-semibold" style={{color: 'rgb(7,72,94)'}}>
                  Product Results
                </h2>
              </div>
              <div className="p-12 text-center">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || filterCategory ? 'No products match your search' : 'No products found'}
                </h3>
                <p className="text-gray-500">
                  {searchTerm || filterCategory 
                    ? 'Try adjusting your search terms or filters.' 
                    : 'Get started by adding your first product.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b" style={{backgroundColor: '#CDE1E6'}}>
                <h2 className="text-lg font-semibold" style={{color: 'rgb(7,72,94)'}}>
                  Product List ({filteredProducts.length} items)
                </h2>
              </div>

              {/* Mobile Card View */}
              <div className="block lg:hidden">
                <div className="grid grid-cols-1 gap-4 p-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                            <Package size={20} className="text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">{product.name}</h3>
                            <p className="text-xs text-gray-500 truncate">{product.modelNumber}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.status === 'Low Stock' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {product.status}
                        </span>
                      </div>

                      <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-3 text-sm">
                        <div className="truncate"><span className="text-gray-600">Brand: </span><span className="font-medium truncate">{product.brand}</span></div>
                        <div className="truncate"><span className="text-gray-600">Category: </span><span className="font-medium truncate">{product.category}</span></div>
                        <div>
                          <span className="text-gray-600">Price: </span>
                          <span className="font-bold" style={{color: 'rgb(7,72,94)'}}>
                            {formatCurrency(product.price)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Stock: </span>
                          <span className={product.stock < 5 ? "text-red-500 font-medium" : "font-medium"}>
                            {product.stock}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: 'rgb(7,72,94)'}}>Product</th>
                      <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: 'rgb(7,72,94)'}}>Brand</th>
                      <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: 'rgb(7,72,94)'}}>Category</th>
                      <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: 'rgb(7,72,94)'}}>Price</th>
                      <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: 'rgb(7,72,94)'}}>Stock</th>
                      <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider xl:table-cell hidden" style={{color: 'rgb(7,72,94)'}}>Added</th>
                      <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: 'rgb(7,72,94)'}}>Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr 
                        key={product.id}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        <td className="px-3 py-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-2">
                              <Package size={16} className="text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate max-w-32" title={product.name}>
                                {product.name}
                              </div>
                              <div className="text-xs text-gray-500 truncate max-w-32" title={product.modelNumber}>
                                {product.modelNumber}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-500 truncate max-w-24" title={product.brand}>
                          {product.brand}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-500 truncate max-w-24" title={product.category}>
                          {product.category}
                        </td>
                        <td className="px-3 py-3 text-sm font-medium text-gray-900">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-500">
                          <span className={product.stock < 5 ? "text-red-500 font-medium" : ""}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-xs text-gray-500 xl:table-cell hidden">
                          {product.addedTime}
                        </td>
                        <td className="px-3 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.status === 'Low Stock' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {product.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProductList;
