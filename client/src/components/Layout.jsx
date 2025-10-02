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
      {/* Skip to content for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-white focus:text-black focus:px-3 focus:py-2 focus:rounded focus:shadow">
        Skip to content
      </a>

      {/* Navbar */}
      {showNavbar ? (
        // Full navbar on auth pages
        <Navbar />
      ) : (
        // Mobile-only navbar on app pages (sidebar present on desktop)
        <div className="md:hidden">
          <Navbar />
        </div>
      )}
      
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
        <main 
          id="main-content"
          role="main"
          className={`flex-1 transition-all duration-300 ${
            showSidebar 
              ? isCollapsed 
                ? 'md:ml-20 ml-0' 
                : 'md:ml-64 ml-0'
              : 'ml-0'
          } ${showNavbar ? 'pt-16' : 'pt-16 md:pt-0'}`}
        >
          <div className="max-w-7xl mx-auto p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
