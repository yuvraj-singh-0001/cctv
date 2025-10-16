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
import SupplierForm from "./masters/supplier-form.jsx"; // sahi path check karein
import SupplierList from "./masters/supplier-list.jsx";
import SalesOrder from './pages/sales-order.jsx';
import ProtectedRoute from "./protected/protected.jsx";
import  SalesOrdersTable from "./pages/sales-orders-list.jsx";
import DebitNoteForm from './pages/DebitNoteForm.jsx';

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
        <Route path="/sales-order" element={
          <ProtectedRoute>
            <Layout showSidebar={true} showNavbar={false}>
              <SalesOrder />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/sales-orders-list" element={
          <ProtectedRoute>
            <Layout showSidebar={true} showNavbar={false}>
              <SalesOrdersTable />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/debit-notes" element={
          <ProtectedRoute>
            <Layout showSidebar={true} showNavbar={false}>
              <DebitNoteForm />
            </Layout>
          </ProtectedRoute>
        } />
        
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
