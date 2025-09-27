// src/App.js
import React from 'react';  
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Dashboard from "./pages/dashboard.jsx"; 
import ProductForm from "./pages/productform.jsx"; 
import UserManagement from "./pages/UserManagement.jsx";
import ProductList from "./pages/ProductList.jsx";
import SupplierForm from "./masters/supplier-form"; // sahi path check karein
import SupplierList from "./masters/supplier-list.jsx";

// Simple protected route wrapper
function ProtectedRoute({ children }) {
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('auth') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth pages with navbar only */}
        <Route path="/login" element={
          <Layout showNavbar={true} showSidebar={false}>
            <Login />
          </Layout>
        } />
        <Route path="/register" element={
          <Layout showNavbar={true} showSidebar={false}>
            <Register />
          </Layout>
        } />
        
        {/* Main app pages with sidebar */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout showSidebar={true} showNavbar={false}>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/productform" element={
          <ProtectedRoute>
            <Layout showSidebar={true} showNavbar={false}>
              <ProductForm onClose={() => {}} onSave={() => {}} />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/user-management" element={
          <ProtectedRoute>
            <Layout showSidebar={true} showNavbar={false}>
              <UserManagement />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/product-list" element={
          <ProtectedRoute>
            <Layout showSidebar={true} showNavbar={false}>
              <ProductList />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/supplier-management" element={
          <ProtectedRoute>
            <Layout showSidebar={true} showNavbar={false}>
              <SupplierForm />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/supplier-list" element={
          <ProtectedRoute>
            <Layout showSidebar={true} showNavbar={false}>
              <SupplierList />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/" element={
          (typeof window !== 'undefined' && localStorage.getItem('auth') === 'true')
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/login" replace />
        } />
      </Routes>
    </Router>
  );
}

export default App;
