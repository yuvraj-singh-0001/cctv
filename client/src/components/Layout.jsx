import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './navbar.jsx';
import Sidebar from './sidebar.jsx';

function Layout({ children, showNavbar = false, showSidebar = true }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Update active tab based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/dashboard') setActiveTab('dashboard');
    else if (path === '/productform') setActiveTab('productform');
    else if (path === '/user-management') setActiveTab('user-management');
    else if (path === '/product-list') setActiveTab('product-list');
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar - only show on login/register pages */}
      {showNavbar && <Navbar />}
      
      <div className="flex">
        {/* Sidebar - show on dashboard and other main pages */}
        {showSidebar && (
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        )}
        
        {/* Main Content Area */}
        <div 
          className={`flex-1 transition-all duration-300 ${
            showSidebar 
              ? isCollapsed 
                ? 'md:ml-20 ml-0' 
                : 'md:ml-64 ml-0'
              : 'ml-0'
          } ${showNavbar ? 'pt-16' : 'pt-0'}`}
        >
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
