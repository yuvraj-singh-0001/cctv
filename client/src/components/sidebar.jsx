// src/components/sidebar.jsx
import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  List,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
  LogOut,
  Building2
} from 'lucide-react';
import { useNavigate } from "react-router-dom"; // ✅ import navigation hook
import Logo from "./logo.png";

function Sidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const navigate = useNavigate(); // ✅ router navigation

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'productform', label: 'Add Product', icon: PlusCircle, path: '/productform' }, // ✅ fixed id + path
    { id: 'user-management', label: 'User Management', icon: Users, path: '/user-management' },
    { id: 'product-list', label: 'Product List', icon: List, path: '/product-list' },
    { id: 'supplier-management', label: 'Supplier Management', icon: Users, path: '/supplier-management' },
    { id: 'supplier-list', label: 'Supplier List', icon: Building2, path: '/supplier-list' } // <-- Add this line
  ];

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
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
      {/* Mobile menu button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-20 p-2 rounded-md"
        style={{backgroundColor: 'rgb(7,72,94)', color: 'white'}}
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 z-40 md:z-10
          ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'} 
          ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}
        style={{borderRight: `1px solid rgba(22, 105, 132, 1)`}}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div 
            className="p-4 border-b flex items-center justify-between"
            style={{borderColor: 'rgb(7,72,94)', backgroundColor: 'rgb(205,225,230)'}}
          >
            {(!isCollapsed || isMobileOpen) ? (
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
                {isMobileOpen ? <X size={20} /> : isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto flex flex-col">
            <ul className="space-y-1 flex-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        navigate(item.path);
                        setIsMobileOpen(false);
                      }}
                      className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === item.id ? 'bg-blue-100' : ''}`}
                    >
                      <Icon size={20} />
                      {!isCollapsed && <span className="ml-3">{item.label}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
            
            {/* Logout Button */}
            <div className="mt-4 pt-4 border-t" style={{borderColor: 'rgba(7,72,94,0.2)'}}>
              <button
                onClick={handleLogout}
                className="w-full flex items-center rounded-lg p-3 transition-colors hover:text-red-400 hover:bg-red-400"
                style={{color: 'rgb(7,72,94)'}}
                title="Logout"
              >
                <LogOut size={20} />
                {(!isCollapsed || isMobileOpen) && <span className="ml-3">Logout</span>}
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
