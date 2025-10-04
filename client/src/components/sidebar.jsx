// src/components/sidebar.jsx
import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  List,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Building2
} from 'lucide-react';
import { useNavigate } from "react-router-dom"; // ✅ import navigation hook
import Logo from "./logo.png";

function Sidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate(); // ✅ router navigation

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    // { id: 'productform', label: 'Add Product', icon: PlusCircle, path: '/productform' },
    { id: 'product-list', label: 'Product Management', icon: List, path: '/product-list' }, // ✅ fixed id + path
    { id: 'user-management', label: 'User Management', icon: Users, path: '/user-management' },
    { id: 'supplier-management', label: 'Supplier Management', icon: Users, path: '/supplier-management' },
    // { id: 'supplier-list', label: 'Supplier List', icon: Building2, path: '/supplier-list' } // <-- Add this line
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    
    // Navigate to login page
    navigate('/login');
  };

  return (
    <>
      {/* Sidebar */}
      <div 
        className={`hidden md:block fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 z-10
          ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}
        style={{borderRight: `1px solid rgba(22, 105, 132, 1)`}}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div 
            className="p-4 border-b flex items-center justify-between"
            style={{borderColor: 'rgb(7,72,94)', backgroundColor: 'rgb(205,225,230)'}}
          >
            {!isCollapsed ? (
              <div className="flex items-center">
                <img src={Logo} alt="CCTV Manager Logo" className="w-8 h-8 mr-2 object-contain" />
                <h1 className="text-xl font-bold" style={{color: 'rgb(7,72,94)'}}>CCTV Manager</h1>
              </div>
            ) : (
              <div className="flex justify-center w-full">
                <img src={Logo} alt="CCTV Manager Logo" className="w-8 h-8 object-contain" />
              </div>
            )}
            <div className="flex items-center">
              <button 
                onClick={toggleSidebar}
                className="p-1 rounded-full hover:bg-gray-100"
                style={{color: 'rgb(7,72,94)'}}
              >
                {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto flex flex-col" role="navigation" aria-label="Sidebar">
            <ul className="space-y-1 flex-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        navigate(item.path);
                      }}
                      className={`relative group w-full flex items-center p-3.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(7,72,94)]
                        ${activeTab === item.id ? 'bg-[rgba(7,72,94,0.12)] text-[rgb(7,72,94)]' : 'text-gray-700 hover:bg-[rgba(7,72,94,0.08)]'}`}
                      aria-current={activeTab === item.id ? 'page' : undefined}
                    >
                      <Icon size={20} className="shrink-0" />
                      {!isCollapsed && <span className="ml-3 truncate">{item.label}</span>}
                      {isCollapsed && (
                        <span className="hidden md:block absolute left-full ml-3 px-2 py-1 rounded-md text-sm text-white bg-[rgb(7,72,94)] shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                          {item.label}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
            
            {/* Logout Button */}
            <div className="mt-4 pt-4 border-t" style={{borderColor: 'rgba(7,72,94,0.2)'}}>
              <button
                onClick={handleLogout}
                className="w-full flex items-center rounded-lg p-3.5 transition-colors text-[rgb(7,72,94)] hover:bg-red-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut size={20} className="shrink-0" />
                {!isCollapsed && <span className="ml-3">Logout</span>}
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
