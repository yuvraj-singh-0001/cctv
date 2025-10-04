import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, LayoutDashboard, PlusCircle, Users, List, Building2, LogOut } from "lucide-react";
import Logo from "../components/logo.png"; // ✅ Correct logo import

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" },
  ];

  // Sidebar menu items replicated for use in mobile navbar
  const appMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'product-list', label: 'Product Management', icon: List, path: '/product-list' },
    { id: 'user-management', label: 'User Management', icon: Users, path: '/user-management' },
    { id: 'supplier-management', label: 'Supplier Management', icon: Users, path: '/supplier-management' },
   // { id: 'supplier-list', label: 'Supplier List', icon: Building2, path: '/supplier-list' }
  ];

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('auth');
    sessionStorage.clear();
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-[#07485E] to-[#CDE1E6] text-white fixed w-full top-0 left-0 z-50 shadow-lg"
      role="navigation"
      aria-label="Top Navigation"
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo & Title */}
        <button
          onClick={() => navigate("/login")}
          className="flex items-center text-2xl font-extrabold hover:scale-105 transition space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(7,72,94)] rounded-md"
          aria-label="Go to login"
        >
          <img src={Logo} alt="CCTV Logo" className="w-8 h-8 rounded-md" /> 
          <span className="text-white">CCTV Manage</span>
        </button>

        {/* Desktop Links */}
        {isAuthPage && (
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                aria-current={location.pathname === link.path ? 'page' : undefined}
                className={`relative font-medium text-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(7,72,94)] rounded-md px-1 ${
                  location.pathname === link.path
                    ? "text-[rgb(205,225,230)]"
                    : "text-white"
                } hover:text-[rgb(205,225,230)]`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.span
                    layoutId="underline"
                    className="absolute left-0 -bottom-1 w-full h-[2px] bg-[rgb(50,106,124)] rounded"
                  />
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(7,72,94)] rounded-md p-1"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="md:hidden bg-[#07485E]/95 backdrop-blur-md px-6 py-4 space-y-3 border-t border-white/10 shadow-inner"
        >
          {isAuthPage ? (
            navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block font-medium text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(7,72,94)] rounded ${
                  location.pathname === link.path
                    ? "text-[#FFD700]"
                    : "text-white"
                } hover:text-[#FFD700] transition`}
              >
                {link.name}
              </Link>
            ))
          ) : (
            <div className="space-y-2">
              {appMenuItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setIsOpen(false); navigate(item.path); }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${active ? 'bg-white/10 text-[#FFD700]' : 'text-white hover:bg-white/10'}`}
                  >
                    <Icon size={18} />
                    <span className="text-base">{item.label}</span>
                  </button>
                );
              })}
              <div className="pt-2 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-white hover:bg-white/10"
                >
                  <LogOut size={18} />
                  <span className="text-base">Logout</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
}

export default Navbar;
