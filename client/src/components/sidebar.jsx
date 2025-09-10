import React from "react";
import { motion } from "framer-motion";
import { 
  Home, 
  Package, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  User
} from "lucide-react";

function Sidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'delivery', label: 'Delivery', icon: <Package size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'customers', label: 'Customers', icon: <Users size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-gradient-to-b from-gray-800 to-gray-900 text-white h-screen fixed left-0 top-0 
        ${isCollapsed ? "w-20" : "w-64"} 
        transition-all duration-300 z-50 flex flex-col shadow-2xl`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!isCollapsed && (
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActiveTab("dashboard")}
            className="text-xl font-bold text-white cursor-pointer hover:text-blue-400"
          >
            MarketPulse360
          </motion.h1>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-700 transition duration-200 ml-auto"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* User Info */}
      {!isCollapsed && user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-4 border-b border-gray-700"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User size={18} />
            </div>
            <div>
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-gray-400 text-xs">{user.email}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation Menu */}
      <nav className="p-4 flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center ${
                  isCollapsed ? "justify-center" : "justify-start"
                } p-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                title={isCollapsed ? item.label : ""}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="ml-3 font-medium text-sm"
                  >
                    {item.label}
                  </motion.span>
                )}
              </motion.button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className={`w-full flex items-center ${
            isCollapsed ? "justify-center" : "justify-start"
          } p-3 rounded-xl text-gray-300 hover:bg-red-600 hover:text-white transition duration-200`}
          title={isCollapsed ? "Logout" : ""}
        >
          <LogOut size={20} />
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="ml-3 font-medium text-sm"
            >
              Logout
            </motion.span>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default Sidebar;
