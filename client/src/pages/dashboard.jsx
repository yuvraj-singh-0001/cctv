// src/pages/dashboard.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
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
  Menu,
  X
} from 'lucide-react';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    inventoryValue: 0,
    lowStockItems: 0,
    todayProducts: 0
  });

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load product data
  useEffect(() => {
    const loadProductData = () => {
      setIsLoading(true);
      try {
        // Mock data based on the screenshot
        const mockProducts = [
          { 
            id: 1, 
            name: 'CCTV', 
            brand: 'CP Plus', 
            category: 'PTZ', 
            price: 15000.00, 
            stock: 100, 
            addedTime: '3/9/2025 at 2:30:08 pm' 
          },
          { 
            id: 2, 
            name: 'DVR', 
            brand: 'Hikvision', 
            category: 'Recording', 
            price: 8000.00, 
            stock: 50, 
            addedTime: '3/9/2025 at 1:15:22 pm' 
          },
          { 
            id: 3, 
            name: 'Camera Dome', 
            brand: 'Dahua', 
            category: 'Dome', 
            price: 4500.00, 
            stock: 3, 
            addedTime: '2/9/2025 at 11:45:10 am' 
          },
          { 
            id: 4, 
            name: 'NVR', 
            brand: 'Hikvision', 
            category: 'Recording', 
            price: 12000.00, 
            stock: 25, 
            addedTime: '1/9/2025 at 4:20:35 pm' 
          },
          { 
            id: 5, 
            name: 'IP Camera', 
            brand: 'CP Plus', 
            category: 'Bullet', 
            price: 6500.00, 
            stock: 75, 
            addedTime: '31/8/2025 at 9:10:45 am' 
          }
        ];

        setProducts(mockProducts);
        
        // Calculate stats
        const totalProducts = mockProducts.length;
        const inventoryValue = mockProducts.reduce((total, product) => 
          total + (product.price * product.stock), 0);
        const lowStockItems = mockProducts.filter(product => product.stock < 5).length;
        const today = new Date().toLocaleDateString();
        const todayProducts = mockProducts.filter(product => 
          product.addedTime.includes(today.split('/')[0])).length;
        
        setStats({
          totalProducts,
          inventoryValue,
          lowStockItems,
          todayProducts
        });
      } catch (error) {
        console.error('Error loading product data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProductData();
  }, []);

  // Refresh data
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
        className="flex h-screen items-center justify-center" 
        style={{backgroundColor: 'rgb(205,225,230)'}}
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
    <div className="flex h-screen relative" style={{backgroundColor: 'rgb(205,225,230)'}}>
      {/* Mobile menu button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md"
        onClick={toggleMobileMenu}
        style={{ color: 'rgb(7,72,94)' }}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`flex-1 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} transition-all duration-300 p-4 md:p-6 overflow-auto`}
      >
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold" 
            style={{color: 'rgb(7,72,94)'}}
          >
            CCTV Inventory Dashboard
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm" 
            style={{color: 'rgb(7,72,94)'}}
          >
            <span className="font-semibold">Powered by CodeScripts</span>
          </motion.div>
        </div>

        {/* Stats Overview */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8"
        >
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <motion.div 
                whileHover={{ rotate: 10 }}
                className="p-2 md:p-3 rounded-lg" 
                style={{backgroundColor: 'rgba(7,72,94,0.1)'}}
              >
                <Package className="h-5 w-5 md:h-6 md:w-6" style={{color: 'rgb(7,72,94)'}} />
              </motion.div>
              <div className="ml-3 md:ml-4">
                <h2 className="text-gray-500 text-xs md:text-sm">Total Products</h2>
                <p className="text-xl md:text-2xl font-bold" style={{color: 'rgb(7,72,94)'}}>{stats.totalProducts}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <motion.div 
                whileHover={{ rotate: 10 }}
                className="p-2 md:p-3 rounded-lg" 
                style={{backgroundColor: 'rgba(7,72,94,0.1)'}}
              >
                <TrendingUp className="h-5 w-5 md:h-6 md:w-6" style={{color: 'rgb(7,72,94)'}} />
              </motion.div>
              <div className="ml-3 md:ml-4">
                <h2 className="text-gray-500 text-xs md:text-sm">Inventory Value</h2>
                <p className="text-xl md:text-2xl font-bold" style={{color: 'rgb(7,72,94)'}}>
                  {formatCurrency(stats.inventoryValue)}
                </p>
              </div>
            </div>
            <div className="mt-1 md:mt-2 text-xs text-gray-500">
              Active products in inventory
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <motion.div 
                whileHover={{ rotate: 10 }}
                className="p-2 md:p-3 rounded-lg" 
                style={{backgroundColor: 'rgba(7,72,94,0.1)'}}
              >
                <PlusCircle className="h-5 w-5 md:h-6 md:w-6" style={{color: 'rgb(7,72,94)'}} />
              </motion.div>
              <div className="ml-3 md:ml-4">
                <h2 className="text-gray-500 text-xs md:text-sm">Today's New Products</h2>
                <p className="text-xl md:text-2xl font-bold" style={{color: 'rgb(7,72,94)'}}>{stats.todayProducts}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <motion.div 
                whileHover={{ rotate: 10 }}
                className="p-2 md:p-3 rounded-lg" 
                style={{backgroundColor: 'rgba(7,72,94,0.1)'}}
              >
                <AlertCircle className="h-5 w-5 md:h-6 md:w-6" style={{color: 'rgb(7,72,94)'}} />
              </motion.div>
              <div className="ml-3 md:ml-4">
                <h2 className="text-gray-500 text-xs md:text-sm">Low Stock Items</h2>
                <p className="text-xl md:text-2xl font-bold" style={{color: 'rgb(7,72,94)'}}>{stats.lowStockItems}</p>
              </div>
            </div>
            <div className="mt-1 md:mt-2 text-xs text-gray-500">
              Products with less than 5 stock
            </div>
          </motion.div>
        </motion.div>

        {/* Today's Products Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6 md:mb-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
            <h2 className="text-base md:text-lg font-medium" style={{color: 'rgb(7,72,94)'}}>
              Today's New Products ({stats.todayProducts})
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <RefreshCw size={18} style={{color: 'rgb(7,72,94)'}} />
            </motion.button>
          </div>
          <div className="p-4 md:p-6">
            <AnimatePresence>
              {stats.todayProducts === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center py-6 md:py-8 text-gray-500"
                >
                  <p>No products added today</p>
                </motion.div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 md:px-6 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{color: 'rgb(7,72,94)'}}>Product Name</th>
                        <th className="px-4 md:px-6 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{color: 'rgb(7,72,94)'}}>Brand</th>
                        <th className="px-4 md:px-6 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{color: 'rgb(7,72,94)'}}>Category</th>
                        <th className="px-4 md:px-6 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{color: 'rgb(7,72,94)'}}>Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.filter(product => {
                        const today = new Date().toLocaleDateString();
                        return product.addedTime.includes(today.split('/')[0]);
                      }).map((product, index) => (
                        <motion.tr 
                          key={product.id}
                          variants={tableRowVariants}
                          initial="hidden"
                          animate="visible"
                          custom={index}
                          whileHover={{ backgroundColor: 'rgba(7,72,94,0.05)' }}
                        >
                          <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                          <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm text-gray-500">{product.brand}</td>
                          <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                          <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm text-gray-500">{formatCurrency(product.price)}</td>
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
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="border-b border-gray-200 px-4 md:px-6 py-3 md:py-4">
            <h2 className="text-base md:text-lg font-medium" style={{color: 'rgb(7,72,94)'}}>Recent Entries (Last 5 Products)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 md:px-6 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{color: 'rgb(7,72,94)'}}>Product Name</th>
                  <th className="px-4 md:px-6 py-2 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell" style={{color: 'rgb(7,72,94)'}}>Brand</th>
                  <th className="px-4 md:px-6 py-2 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell" style={{color: 'rgb(7,72,94)'}}>Category</th>
                  <th className="px-4 md:px-6 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{color: 'rgb(7,72,94)'}}>Price</th>
                  <th className="px-4 md:px-6 py-2 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell" style={{color: 'rgb(7,72,94)'}}>Stock</th>
                  <th className="px-4 md:px-6 py-2 text-left text-xs font-medium uppercase tracking-wider hidden xl:table-cell" style={{color: 'rgb(7,72,94)'}}>Added Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.slice(0, 5).map((product, index) => (
                  <motion.tr 
                    key={product.id}
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    whileHover={{ backgroundColor: 'rgba(7,72,94,0.05)' }}
                    className="cursor-pointer"
                  >
                    <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{product.brand}</td>
                    <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{product.category}</td>
                    <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm text-gray-500">{formatCurrency(product.price)}</td>
                    <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">{product.stock}</td>
                    <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">{product.addedTime}</td>
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
          className="mt-4 md:mt-6 text-xs md:text-sm" 
          style={{color: 'rgb(7,72,94)'}}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <span>CCTV Inventory Manager &gt;1.0</span>
            <span className="font-semibold">Note: admin</span>
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}

export default Dashboard;