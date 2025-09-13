// src/App.js
import React from 'react';  
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Dashboard from "./pages/dashboard.jsx"; 
import ProductForm from "./pages/productform.jsx"; 
import UserManagement from "./pages/UserManagement.jsx"; // ✅ import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<><Navbar /><Login /></>} />
        <Route path="/register" element={<><Navbar /><Register /></>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/productform" element={<ProductForm onClose={() => {}} onSave={() => {}} />} /> 
        <Route path="/user-management" element={<UserManagement />} /> {/* ✅ added */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
