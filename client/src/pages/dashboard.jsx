// src/pages/dashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, 
  Users, 
  List, 
  RefreshCw,
  Package,
  TrendingUp,
  AlertCircle,
  Clock,
  Search,
  Filter,
  Download,
  MoreVertical
} from 'lucide-react';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    inventoryValue: 0,
    lowStockItems: 0,
    todayProducts: 0
  });
  const [screenSize, setScreenSize] = useState('lg');

  // Load product data
  useEffect(() => {
    const loadProductData = async () => {
      setIsLoading(true);
      try {
        // Fetch products from API
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        
        if (data.success) {
          const fetchedProducts = data.products;
          setProducts(fetchedProducts);
          
          // Calculate stats
          const totalProducts = fetchedProducts.length;
          const inventoryValue = fetchedProducts.reduce((total, product) => 
            total + (product.price * product.stock), 0);
          const lowStockItems = fetchedProducts.filter(product => product.stock < 5).length;
          
          // Get today's products
          const today = new Date();
          const todayFormatted = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
          const todayProducts = fetchedProducts.filter(product => 
            product.addedTime.includes(todayFormatted)).length;
          
          setStats({
            totalProducts,
            inventoryValue,
            lowStockItems,
            todayProducts
          });
        } else {
          console.error('Error fetching products:', data.message);
          // Fallback to empty state
          setProducts([]);
          setStats({
            totalProducts: 0,
            inventoryValue: 0,
            lowStockItems: 0,
            todayProducts: 0
          });
        }
      } catch (error) {
        console.error('Error loading product data:', error);
        // Fallback to empty state
        setProducts([]);
        setStats({
          totalProducts: 0,
          inventoryValue: 0,
          lowStockItems: 0,
          todayProducts: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProductData();
  }, []);

  // Refresh data
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Fetch products from API
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      
      if (data.success) {
        const fetchedProducts = data.products;
        setProducts(fetchedProducts);
        
        // Calculate stats
        const totalProducts = fetchedProducts.length;
        const inventoryValue = fetchedProducts.reduce((total, product) => 
          total + (product.price * product.stock), 0);
        const lowStockItems = fetchedProducts.filter(product => product.stock < 5).length;
        
        // Get today's products
        const today = new Date();
        const todayFormatted = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
        const todayProducts = fetchedProducts.filter(product => 
          product.addedTime.includes(todayFormatted)).length;
        
        setStats({
          totalProducts,
          inventoryValue,
          lowStockItems,
          todayProducts
        });
      }
    } catch (error) {
      console.error('Error refreshing product data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (screenSize === 'xs') {
      return dateString.split(' at ')[0]; // Just show date on extra small screens
    } else if (screenSize === 'sm') {
      return dateString.replace(' at ', '\n');
    }
    return dateString;
  };


  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex h-64 items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="h-12 w-12 mx-auto" style={{color: 'rgb(7,72,94)'}} />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4" 
            style={{color: 'rgb(7,72,94)'}}
          >
            Loading dashboard...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* Header Section */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl sm:text-2xl font-bold truncate" 
          style={{color: 'rgb(7,72,94)'}}
        >
          CCTV Inventory Dashboard
        </motion.h1>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs sm:text-sm hidden xs:block" 
              style={{color: 'rgb(7,72,94)'}}
            >
              <span className="font-semibold">Powered by CodeScripts</span>
            </motion.div>
            
            {/* Search bar for larger screens */}
            {screenSize !== 'xs' && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                className="hidden sm:flex items-center bg-white rounded-lg px-3 py-2 shadow-sm"
              >
                <Search size={16} className="text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="ml-2 outline-none text-sm w-32 md:w-40"
                />
              </motion.div>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 rounded-lg bg-white shadow-sm"
              style={{ color: 'rgb(7,72,94)' }}
            >
              <RefreshCw size={18} />
            </motion.button>
          </div>
        </div>

        {/* Search bar for extra small screens */}
        {screenSize === 'xs' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center bg-white rounded-lg px-3 py-2 shadow-sm"
          >
            <Search size={16} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="ml-2 outline-none text-sm flex-1"
            />
          </motion.div>
        )}

        {/* Stats Overview */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8"
        >
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <motion.div 
                whileHover={{ rotate: 10 }}
                className="p-2 sm:p-3 rounded-lg" 
                style={{backgroundColor: 'rgba(7,72,94,0.1)'}}
              >
                <Package className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" style={{color: 'rgb(7,72,94)'}} />
              </motion.div>
              <div className="ml-2 sm:ml-3 md:ml-4">
                <h2 className="text-gray-500 text-xs sm:text-sm">Total Products</h2>
                <p className="text-lg sm:text-xl md:text-2xl font-bold" style={{color: 'rgb(7,72,94)'}}>{stats.totalProducts}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <motion.div 
                whileHover={{ rotate: 10 }}
                className="p-2 sm:p-3 rounded-lg" 
                style={{backgroundColor: 'rgba(7,72,94,0.1)'}}
              >
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" style={{color: 'rgb(7,72,94)'}} />
              </motion.div>
              <div className="ml-2 sm:ml-3 md:ml-4">
                <h2 className="text-gray-500 text-xs sm:text-sm">Inventory Value</h2>
                <p className="text-lg sm:text-xl md:text-2xl font-bold" style={{color: 'rgb(7,72,94)'}}>
                  {formatCurrency(stats.inventoryValue)}
                </p>
              </div>
            </div>
            <div className="mt-1 text-xs text-gray-500 hidden xs:block">
              Active products in inventory
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <motion.div 
                whileHover={{ rotate: 10 }}
                className="p-2 sm:p-3 rounded-lg" 
                style={{backgroundColor: 'rgba(7,72,94,0.1)'}}
              >
                <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" style={{color: 'rgb(7,72,94)'}} />
              </motion.div>
              <div className="ml-2 sm:ml-3 md:ml-4">
                <h2 className="text-gray-500 text-xs sm:text-sm">Today's New</h2>
                <p className="text-lg sm:text-xl md:text-2xl font-bold" style={{color: 'rgb(7,72,94)'}}>{stats.todayProducts}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <motion.div 
                whileHover={{ rotate: 10 }}
                className="p-2 sm:p-3 rounded-lg" 
                style={{backgroundColor: 'rgba(7,72,94,0.1)'}}
              >
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" style={{color: 'rgb(7,72,94)'}} />
              </motion.div>
              <div className="ml-2 sm:ml-3 md:ml-4">
                <h2 className="text-gray-500 text-xs sm:text-sm">Low Stock</h2>
                <p className="text-lg sm:text-xl md:text-2xl font-bold" style={{color: 'rgb(7,72,94)'}}>{stats.lowStockItems}</p>
              </div>
            </div>
            <div className="mt-1 text-xs text-gray-500 hidden xs:block">
              Products with less than 5 stock
            </div>
          </motion.div>
        </motion.div>

        {/* Today's Products Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-4 sm:mb-6 md:mb-8 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-0">
            <h2 className="text-base sm:text-lg font-medium" style={{color: 'rgb(7,72,94)'}}>
              Today's New Products ({stats.todayProducts})
            </h2>
            <div className="flex items-center gap-2 self-end xs:self-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-1 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1"
              >
                <Filter size={14} className="hidden xs:block" />
                <span className="text-xs">Filter</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-1 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1"
              >
                <Download size={14} className="hidden xs:block" />
                <span className="text-xs">Export</span>
              </motion.button>
            </div>
          </div>
          <div className="p-3 sm:p-4 md:p-6">
            <AnimatePresence>
              {stats.todayProducts === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-4 sm:py-6 md:py-8 text-gray-500"
                >
                  <Package size={40} className="opacity-50 mb-2" />
                  <p className="text-sm sm:text-base">No products added today</p>
                  <p className="text-xs mt-1 text-center">New products will appear here once added</p>
                </motion.div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{color: 'rgb(7,72,94)'}}>Product</th>
                        <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-medium uppercase tracking-wider hidden xs:table-cell" style={{color: 'rgb(7,72,94)'}}>Brand</th>
                        <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell" style={{color: 'rgb(7,72,94)'}}>Category</th>
                        <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{color: 'rgb(7,72,94)'}}>Price</th>
                        {screenSize !== 'xs' && (
                          <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{color: 'rgb(7,72,94)'}}>Status</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.filter(product => {
                        const today = new Date();
                        const todayFormatted = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
                        return product.addedTime.includes(todayFormatted.split('/')[0]);
                      }).map((product, index) => (
                        <motion.tr 
                          key={product.id}
                          variants={tableRowVariants}
                          initial="hidden"
                          animate="visible"
                          custom={index}
                          whileHover={{ backgroundColor: 'rgba(7,72,94,0.05)' }}
                        >
                          <td className="px-2 sm:px-3 md:px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2 hidden xs:flex">
                                <Package size={12} className="text-blue-600" />
                              </div>
                              <span className="truncate max-w-[120px] xs:max-w-none">{product.name}</span>
                            </div>
                          </td>
                          <td className="px-2 sm:px-3 md:px-4 py-2 whitespace-nowrap text-sm text-gray-500 hidden xs:table-cell">{product.brand}</td>
                          <td className="px-2 sm:px-3 md:px-4 py-2 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{product.category}</td>
                          <td className="px-2 sm:px-3 md:px-4 py-2 whitespace-nowrap text-sm text-gray-500 font-medium">{formatCurrency(product.price)}</td>
                          {screenSize !== 'xs' && (
                            <td className="px-2 sm:px-3 md:px-4 py-2 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                product.status === 'Low Stock' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {product.status}
                              </span>
                            </td>
                          )}
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Recent Entries Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-0">
            <h2 className="text-base sm:text-lg font-medium" style={{color: 'rgb(7,72,94)'}}>
              Recent Entries ({products.length})
            </h2>
            <div className="flex items-center gap-2 self-end xs:self-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-1 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <MoreVertical size={16} />
              </motion.button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{color: 'rgb(7,72,94)'}}>Product</th>
                  <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-medium uppercase tracking-wider hidden xs:table-cell" style={{color: 'rgb(7,72,94)'}}>Brand</th>
                  <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell" style={{color: 'rgb(7,72,94)'}}>Category</th>
                  <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{color: 'rgb(7,72,94)'}}>Price</th>
                  <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell" style={{color: 'rgb(7,72,94)'}}>Stock</th>
                  <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell" style={{color: 'rgb(7,72,94)'}}>Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product, index) => (
                  <motion.tr 
                    key={product.id}
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    whileHover={{ backgroundColor: 'rgba(7,72,94,0.05)' }}
                    className="cursor-pointer"
                  >
                    <td className="px-2 sm:px-3 md:px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2 hidden xs:flex">
                          <Package size={12} className="text-blue-600" />
                        </div>
                        <span className="truncate max-w-[100px] xs:max-w-none">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-3 md:px-4 py-2 whitespace-nowrap text-sm text-gray-500 hidden xs:table-cell">{product.brand}</td>
                    <td className="px-2 sm:px-3 md:px-4 py-2 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{product.category}</td>
                    <td className="px-2 sm:px-3 md:px-4 py-2 whitespace-nowrap text-sm text-gray-500 font-medium">{formatCurrency(product.price)}</td>
                    <td className="px-2 sm:px-3 md:px-4 py-2 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      <span className={product.stock < 5 ? "text-red-500 font-medium" : ""}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 md:px-4 py-2 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell whitespace-pre-line">
                      {formatDate(product.addedTime)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-3 sm:mt-4 md:mt-6 text-xs sm:text-sm flex flex-col xs:flex-row justify-between items-center gap-2" 
          style={{color: 'rgb(7,72,94)'}}
        >
          <span>CCTV Inventory Manager v1.0</span>
          <div className="flex items-center gap-4">
            <span className="font-semibold">Note: admin</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">Powered by CodeScripts</span>
          </div>
        </motion.div>
    </motion.div>
  );
}

export default Dashboard;
