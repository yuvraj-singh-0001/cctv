
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import API_BASE_URL from "../components/apiconfig/api-config";
import {X,CheckCircle} from 'lucide-react';

const ProductForm = () => {
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/products/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSubmitSuccess(true);
        window.dispatchEvent(new CustomEvent('productAdded', {
          detail: { productId: data.productId }
        }));
        setTimeout(() => {
          setSubmitSuccess(false);
          setFormData({
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
        }, 2000);
      } else {
        alert('Error adding product: ' + data.message);
      }
    } catch (error) {
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full overflow-x-hidden px-3 sm:px-0">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-2">
          <p className="text-gray-600 text-sm mt-1">Fill in the product details to add to inventory</p>
        </motion.div>

        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-sm"
          >
            <CheckCircle size={16} className="text-green-600 " />
            <span className="text-green-700 font-medium">Product added successfully!</span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="px-4 py-2 border-b flex justify-between items-center" style={{ backgroundColor: '#CDE1E6' }}>
            <h2 className="text-base font-semibold" style={{ color: 'rgb(7,72,94)' }}>Product Information</h2>
            <button
              type="button"
              onClick={() =>
                setFormData({
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
                })
              }
              className="px-2 py-1 rounded-md text-sm font-medium border"
              style={{
                backgroundColor: 'white',
                color: 'rgb(7,72,94)',
                borderColor: 'rgb(7,72,94)'
              }}
            >
              <X size={14} />
            </button>
          </div>

          <form id="product-form" onSubmit={handleSubmit} className="p-4 space-y-3 text-sm">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-xs">Product Name *</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring-1 focus:ring-[rgb(7,72,94)]"
                  placeholder="e.g., Dome Camera"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-xs">Model Number *</label>
                <input
                  type="text"
                  name="modelNumber"
                  value={formData.modelNumber}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring-1 focus:ring-[rgb(7,72,94)]"
                  placeholder="e.g., DS-2CD2043"
                  required
                />
              </div>
            </div>

            {/* Brand + Category */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-xs">Brand *</label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring-1 focus:ring-[rgb(7,72,94)]"
                  required
                >
                  <option value="">Select Brand</option>
                  <option>Hikvision</option>
                  <option>Dahua</option>
                  <option>CP Plus</option>
                  <option>Bosch</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-xs">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring-1 focus:ring-[rgb(7,72,94)]"
                  required
                >
                  <option value="">Select Category</option>
                  <option>Dome</option>
                  <option>Bullet</option>
                  <option>PTZ</option>
                </select>
              </div>
            </div>

            {/* Price + Quantity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-xs">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring-1 focus:ring-[rgb(7,72,94)]"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-xs">Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring-1 focus:ring-[rgb(7,72,94)]"
                  required
                />
              </div>
            </div>

            {/* Technical Specs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-xs">Resolution</label>
                <select
                  name="resolution"
                  value={formData.resolution}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring-1 focus:ring-[rgb(7,72,94)]"
                >
                  <option value="">Select</option>
                  <option>1080p</option>
                  <option>2MP</option>
                  <option>4MP</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-xs">Lens Specification</label>
                <input
                  type="text"
                  name="lensSpecification"
                  value={formData.lensSpecification}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring-1 focus:ring-[rgb(7,72,94)]"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-row items-center justify-between gap-6 mt-3">
              {/* Checkboxes */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    name="poeSupport"
                    checked={formData.poeSupport}
                    onChange={handleChange}
                    className="h-4 w-4 accent-[rgb(7,72,94)]"
                  />
                  PoE Support
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    name="nightVision"
                    checked={formData.nightVision}
                    onChange={handleChange}
                    className="h-4 w-4 accent-[rgb(7,72,94)]"
                  />
                  Night Vision
                </label>
              </div>

              {/* Submit Button (side me right) */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2 px-6 rounded-md font-medium transition-all"
                style={{
                  backgroundColor: 'rgb(7,72,94)',
                  color: 'white'
                }}
              >
                {isSubmitting ? 'Saving...' : 'Save Product'}
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductForm;
