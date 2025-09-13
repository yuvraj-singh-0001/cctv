// src/components/ProductForm.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Plus } from 'lucide-react';

const ProductForm = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    productName: '',
    modelNumber: '',
    brand: '',
    category: '',
    price: '',
    quantity: '',
    resolution: '',
    lensSpecification: '',
    poeSupport: false,
    nightVision: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold" style={{ color: 'rgb(7,72,94)' }}>
            Add New CCTV Product
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={24} style={{ color: 'rgb(7,72,94)' }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information Section */}
          <div>
            <h3 className="text-lg font-medium mb-4" style={{ color: 'rgb(7,72,94)' }}>
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="e.g., HIKVISION 2MP"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model Number *
                </label>
                <input
                  type="text"
                  name="modelNumber"
                  value={formData.modelNumber}
                  onChange={handleChange}
                  placeholder="e.g., DS-2CD2342WD-I"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Brand and Category Section */}
          <div>
            <h3 className="text-lg font-medium mb-4" style={{ color: 'rgb(7,72,94)' }}>
              Brand & Category
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand *
                </label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Brand</option>
                  <option value="Hikvision">Hikvision</option>
                  <option value="Dahua">Dahua</option>
                  <option value="CP Plus">CP Plus</option>
                  <option value="Bosch">Bosch</option>
                  <option value="Axis">Axis</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Dome">Dome</option>
                  <option value="Bullet">Bullet</option>
                  <option value="PTZ">PTZ</option>
                  <option value="Box">Box</option>
                  <option value="C-Mount">C-Mount</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Pricing & Inventory Section */}
          <div>
            <h3 className="text-lg font-medium mb-4" style={{ color: 'rgb(7,72,94)' }}>
              Pricing & Inventory
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity in Stock *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Technical Specifications Section */}
          <div>
            <h3 className="text-lg font-medium mb-4" style={{ color: 'rgb(7,72,94)' }}>
              Technical Specifications
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resolution
                </label>
                <select
                  name="resolution"
                  value={formData.resolution}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Resolution</option>
                  <option value="720p">720p</option>
                  <option value="1080p">1080p (Full HD)</option>
                  <option value="2MP">2MP</option>
                  <option value="4MP">4MP</option>
                  <option value="5MP">5MP</option>
                  <option value="4K">4K (8MP)</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lens Specification
                </label>
                <input
                  type="text"
                  name="lensSpecification"
                  value={formData.lensSpecification}
                  onChange={handleChange}
                  placeholder="e.g., 2.8mm, varifocal"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mt-4 space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="poeSupport"
                  checked={formData.poeSupport}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">Power over Ethernet (PoE) Support</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="nightVision"
                  checked={formData.nightVision}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">Night Vision Capability</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              style={{ backgroundColor: 'rgb(7,72,94)' }}
            >
              <Save size={18} className="mr-2" />
              Save Product
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProductForm;