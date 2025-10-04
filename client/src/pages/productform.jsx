// src/pages/productform.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import API_BASE_URL  from "../components/apiconfig/api-config";
import { 
  Package, 
  Save, 
  X, 
  DollarSign, 
  Hash, 
  Tag, 
  Camera, 
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSubmitSuccess(true);
        
        // Dispatch custom event to notify other components about product addition
        window.dispatchEvent(new CustomEvent('productAdded', { 
          detail: { productId: data.productId } 
        }));
        
        // Reset form after success
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
        console.error('Error adding product:', data.message);
        alert('Error adding product: ' + data.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full overflow-x-hidden px-3 sm:px-0">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          {/* <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-white shadow-sm">
              <Package size={24} style={{color: 'rgb(7,72,94)'}} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold truncate" style={{color: 'rgb(7,72,94)'}}>
              CCTV Product Form
            </h1>
          </div> */}
          <p className=" text-gray-600 ml-0 sm:ml-4">
            Fill in the product details to add to your inventory
          </p>
        </motion.div>

        {/* Success Message */}
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
          >
            <CheckCircle size={20} className="text-green-600" />
            <span className="text-green-800 font-medium">Product added successfully!</span>
          </motion.div>
        )}

        {/* Form Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Form Header with Save Button */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3" style={{backgroundColor: '#CDE1E6'}}>
            <h2 className="text-lg font-semibold" style={{color: 'rgb(7,72,94)'}}>
              Product Information
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
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
                }}
                className="px-3 sm:px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md flex items-center gap-2 w-full sm:w-auto text-sm sm:text-base"
                style={{
                  backgroundColor: 'white',
                  color: 'rgb(7,72,94)',
                  border: '2px solid rgb(7,72,94)'
                }}
              >
                <X size={16} />
                Clear
              </button>
              <button
                type="submit"
                form="product-form"
                disabled={isSubmitting}
                className="px-3 sm:px-4 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 transition-all hover:shadow-lg w-full sm:w-auto text-sm sm:text-base"
                style={{
                  backgroundColor: 'rgb(7,72,94)',
                  color: 'white',
                  border: '2px solid rgb(7,72,94)'
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Form */}
          <form id="product-form" onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Basic Information Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package size={20} style={{color: 'rgb(7,72,94)'}} />
                <h3 className="text-lg font-semibold" style={{color: 'rgb(7,72,94)'}}>
                  Basic Information
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: 'rgb(7,72,94)'}}>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    placeholder="e.g., HIKVISION 2MP Dome Camera"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                    style={{'--tw-ring-color': 'rgb(7,72,94)'}}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: 'rgb(7,72,94)'}}>
                    Model Number *
                  </label>
                  <input
                    type="text"
                    name="modelNumber"
                    value={formData.modelNumber}
                    onChange={handleChange}
                    placeholder="e.g., DS-2CD2342WD-I"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                    style={{'--tw-ring-color': 'rgb(7,72,94)'}}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Tag size={20} style={{color: 'rgb(7,72,94)'}} />
                <h3 className="text-lg font-semibold" style={{color: 'rgb(7,72,94)'}}>
                  Brand & Category
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: 'rgb(7,72,94)'}}>
                    Brand *
                  </label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                    style={{'--tw-ring-color': 'rgb(7,72,94)'}}
                    required
                  >
                    <option value="">Select Brand</option>
                    <option value="Hikvision">Hikvision</option>
                    <option value="Dahua">Dahua</option>
                    <option value="CP Plus">CP Plus</option>
                    <option value="Bosch">Bosch</option>
                    <option value="Axis">Axis</option>
                    <option value="FLIR">FLIR</option>
                    <option value="Reolink">Reolink</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: 'rgb(7,72,94)'}}>
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                    style={{'--tw-ring-color': 'rgb(7,72,94)'}}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Dome">Dome Camera</option>
                    <option value="Bullet">Bullet Camera</option>
                    <option value="PTZ">PTZ Camera</option>
                    <option value="Recording">Recording Equipment</option>
                    <option value="Sensors">Sensors</option>
                    <option value="Access Control">Access Control</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign size={20} style={{color: 'rgb(7,72,94)'}} />
                <h3 className="text-lg font-semibold" style={{color: 'rgb(7,72,94)'}}>
                  Pricing & Inventory
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: 'rgb(7,72,94)'}}>
                    Price (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">₹</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                      style={{'--tw-ring-color': 'rgb(7,72,94)'}}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: 'rgb(7,72,94)'}}>
                    Quantity in Stock *
                  </label>
                  <div className="relative">
                    <Hash size={16} className="absolute left-3 top-3.5 text-gray-500" />
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      min="0"
                      placeholder="0"
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                      style={{'--tw-ring-color': 'rgb(7,72,94)'}}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings size={20} style={{color: 'rgb(7,72,94)'}} />
                <h3 className="text-lg font-semibold" style={{color: 'rgb(7,72,94)'}}>
                  Technical Specifications
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: 'rgb(7,72,94)'}}>
                    Resolution
                  </label>
                  <select
                    name="resolution"
                    value={formData.resolution}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                    style={{'--tw-ring-color': 'rgb(7,72,94)'}}
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
                  <label className="block text-sm font-medium mb-2" style={{color: 'rgb(7,72,94)'}}>
                    Lens Specification
                  </label>
                  <input
                    type="text"
                    name="lensSpecification"
                    value={formData.lensSpecification}
                    onChange={handleChange}
                    placeholder="e.g., 2.8mm, varifocal"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                    style={{'--tw-ring-color': 'rgb(7,72,94)'}}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    name="poeSupport"
                    checked={formData.poeSupport}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300"
                    style={{accentColor: 'rgb(7,72,94)'}}
                  />
                  <span className="ml-3 text-gray-700 font-medium">Power over Ethernet (PoE) Support</span>
                </label>
                
                <label className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    name="nightVision"
                    checked={formData.nightVision}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300"
                    style={{accentColor: 'rgb(7,72,94)'}}
                  />
                  <span className="ml-3 text-gray-700 font-medium">Night Vision Capability</span>
                </label>
              </div>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductForm;