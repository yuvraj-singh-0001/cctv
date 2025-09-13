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
          <Layout showSidebar={true} showNavbar={false}>
            <Dashboard />
          </Layout>
        } />
        <Route path="/productform" element={
          <Layout showSidebar={true} showNavbar={false}>
            <ProductForm onClose={() => {}} onSave={() => {}} />
          </Layout>
        } />
        <Route path="/user-management" element={
          <Layout showSidebar={true} showNavbar={false}>
            <UserManagement />
          </Layout>
        } />
        <Route path="/product-list" element={
          <Layout showSidebar={true} showNavbar={false}>
            <ProductList />
          </Layout>
        } />
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
