// src/pages/OrderForm.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API_BASE_URL from "../components/apiconfig/api-config";
import { 
  ShoppingCart, 
  Save, 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Package,
  DollarSign,
  Percent,
  Truck,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';

const OrderForm = () => {
  const [formData, setFormData] = useState({
    order_number: `ORD-${Date.now()}`,
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_address: '',
    items: [{ product: '', quantity: 1, price: 0, total: 0 }],
    subtotal: 0,
    tax: 0,
    discount: 0,
    grand_total: 0,
    payment_status: 'Pending',
    order_status: 'Processing'
  });

  const [products, setProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Calculate totals when items change
  useEffect(() => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.total || 0), 0);
    const taxAmount = (subtotal * formData.tax) / 100;
    const grandTotal = subtotal + taxAmount - formData.discount;
    
    setFormData(prev => ({
      ...prev,
      subtotal,
      grand_total: Math.max(0, grandTotal)
    }));
  }, [formData.items, formData.tax, formData.discount]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    
    if (field === 'product') {
      // When product is selected, find the actual product
      const selectedProduct = products.find(p => p.id === value);
     
      
      if (selectedProduct) {
        updatedItems[index] = {
          ...updatedItems[index],
          product: selectedProduct.id, // Store the product ID
          price: selectedProduct.price, // Set the price from product
          quantity: 1, // Reset quantity to 1
          total: selectedProduct.price // Calculate initial total
        };
      } else {
        updatedItems[index] = {
          ...updatedItems[index],
          [field]: value
        };
      }
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: field === 'quantity' || field === 'price' ? parseFloat(value) || 0 : value
      };

      // Calculate item total
      if (field === 'quantity' || field === 'price') {
        updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].price;
      }
    }

    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { product: '', quantity: 1, price: 0, total: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        items: updatedItems
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare data for backend
      const orderData = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        customer_email: formData.customer_email,
        customer_address: formData.customer_address,
        items: formData.items.map(item => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          total: item.total
        })),
        subtotal: formData.subtotal,
        tax: formData.tax,
        discount: formData.discount,
        grand_total: formData.grand_total,
        payment_status: formData.payment_status,
        order_status: formData.order_status
      };

      
      
      const response = await fetch(`${API_BASE_URL}/api/orders/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
     

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      if (data.success) {
        setSubmitSuccess(true);
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('orderAdded', { 
          detail: { orderId: data.orderId } 
        }));
        
        // Reset form after success
        setTimeout(() => {
          setSubmitSuccess(false);
          setFormData({
            order_number: `ORD-${Date.now()}`,
            customer_name: '',
            customer_phone: '',
            customer_email: '',
            customer_address: '',
            items: [{ product: '', quantity: 1, price: 0, total: 0 }],
            subtotal: 0,
            tax: 0,
            discount: 0,
            grand_total: 0,
            payment_status: 'Pending',
            order_status: 'Processing'
          });
        }, 2000);
      } else {
        console.error('Error creating order:', data.message);
        alert('Error creating order: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full overflow-x-hidden px-3 sm:px-0">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <p className="text-gray-600 ml-0 sm:ml-4">
            Create a new sales order for your customer
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
            <span className="text-green-800 font-medium">Order created successfully!</span>
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
              Order Information
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    order_number: `ORD-${Date.now()}`,
                    customer_name: '',
                    customer_phone: '',
                    customer_email: '',
                    customer_address: '',
                    items: [{ product: '', quantity: 1, price: 0, total: 0 }],
                    subtotal: 0,
                    tax: 0,
                    discount: 0,
                    grand_total: 0,
                    payment_status: 'Pending',
                    order_status: 'Processing'
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
                form="order-form"
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
                    Creating Order...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Create Order
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Form */}
          <form id="order-form" onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
            {/* Order Info Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart size={20} style={{color: 'rgb(7,72,94)'}} />
                <h3 className="text-lg font-semibold" style={{color: 'rgb(7,72,94)'}}>
                  Order Information
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: 'rgb(7,72,94)'}}>
                    Order Number *
                  </label>
                  <input
                    type="text"
                    name="order_number"
                    value={formData.order_number}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors bg-gray-50"
                    style={{'--tw-ring-color': 'rgb(7,72,94)'}}
                    required
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Customer Details Section */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <User size={20} style={{color: 'rgb(7,72,94)'}} />
                <h3 className="text-lg font-semibold" style={{color: 'rgb(7,72,94)'}}>
                  Customer Details
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: 'rgb(7,72,94)'}}>
                    Customer Name *
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-3.5 text-gray-500" />
                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      placeholder="Enter customer name"
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                      style={{'--tw-ring-color': 'rgb(7,72,94)'}}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: 'rgb(7,72,94)'}}>
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3.5 text-gray-500" />
                    <input
                      type="tel"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                      style={{'--tw-ring-color': 'rgb(7,72,94)'}}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: 'rgb(7,72,94)'}}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-3.5 text-gray-500" />
                    <input
                      type="email"
                      name="customer_email"
                      value={formData.customer_email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                      style={{'--tw-ring-color': 'rgb(7,72,94)'}}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2" style={{color: 'rgb(7,72,94)'}}>
                  Delivery Address *
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3 text-gray-500" />
                  <textarea
                    name="customer_address"
                    value={formData.customer_address}
                    onChange={handleChange}
                    placeholder="Enter complete delivery address"
                    rows="3"
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors resize-none"
                    style={{'--tw-ring-color': 'rgb(7,72,94)'}}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Product Selection Section */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Package size={20} style={{color: 'rgb(7,72,94)'}} />
                <h3 className="text-lg font-semibold" style={{color: 'rgb(7,72,94)'}}>
                  Product Selection
                </h3>
              </div>

              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-end p-4 border border-gray-200 rounded-lg">
                    <div className="col-span-12 md:col-span-5">
                      <label className="block text-sm font-medium mb-2" style={{color: 'rgb(7,72,94)'}}>
                        Product
                      </label>
                      <select
                        value={item.product}
                        onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                        style={{'--tw-ring-color': 'rgb(7,72,94)'}}
                        required
                      >
                        <option value="">Select Product</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} - ₹{product.price}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-6 md:col-span-2">
                      <label className="block text-sm font-medium mb-2" style={{color: 'rgb(7,72,94)'}}>
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                        style={{'--tw-ring-color': 'rgb(7,72,94)'}}
                        required
                      />
                    </div>

                    <div className="col-span-6 md:col-span-2">
                      <label className="block text-sm font-medium mb-2" style={{color: 'rgb(7,72,94)'}}>
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                        style={{'--tw-ring-color': 'rgb(7,72,94)'}}
                        required
                        readOnly={item.product} // Make price read-only when product is selected
                      />
                    </div>

                    <div className="col-span-8 md:col-span-2">
                      <label className="block text-sm font-medium mb-2" style={{color: 'rgb(7,72,94)'}}>
                        Total (₹)
                      </label>
                      <input
                        type="text"
                        value={`₹${item.total.toFixed(2)}`}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                        readOnly
                      />
                    </div>

                    <div className="col-span-4 md:col-span-1">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={formData.items.length === 1}
                        className="w-full p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Trash2 size={16} className="mx-auto" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                  style={{
                    backgroundColor: 'rgb(7,72,94)',
                    color: 'white'
                  }}
                >
                  <Plus size={16} />
                  Add Product
                </button>
              </div>
            </div>

            {/* Summary Section */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign size={20} style={{color: 'rgb(7,72,94)'}} />
                <h3 className="text-lg font-semibold" style={{color: 'rgb(7,72,94)'}}>
                  Order Summary
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: 'rgb(7,72,94)'}}>
                    Subtotal (₹)
                  </label>
                  <input
                    type="text"
                    value={`₹${formData.subtotal.toFixed(2)}`}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: 'rgb(7,72,94)'}}>
                    Tax (%)
                  </label>
                  <div className="relative">
                    <Percent size={16} className="absolute left-3 top-3.5 text-gray-500" />
                    <input
                      type="number"
                      name="tax"
                      value={formData.tax}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                      style={{'--tw-ring-color': 'rgb(7,72,94)'}}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: 'rgb(7,72,94)'}}>
                    Discount (₹)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                    style={{'--tw-ring-color': 'rgb(7,72,94)'}}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: 'rgb(7,72,94)'}}>
                    Grand Total (₹)
                  </label>
                  <input
                    type="text"
                    value={`₹${formData.grand_total.toFixed(2)}`}
                    className="w-full p-3 border-2 font-semibold rounded-lg"
                    style={{
                      borderColor: 'rgb(7,72,94)',
                      backgroundColor: '#f0f9ff'
                    }}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Status Section */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck size={20} style={{color: 'rgb(7,72,94)'}} />
                <h3 className="text-lg font-semibold" style={{color: 'rgb(7,72,94)'}}>
                  Order Status
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: 'rgb(7,72,94)'}}>
                    Payment Status
                  </label>
                  <select
                    name="payment_status"
                    value={formData.payment_status}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                    style={{'--tw-ring-color': 'rgb(7,72,94)'}}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: 'rgb(7,72,94)'}}>
                    Order Status
                  </label>
                  <select
                    name="order_status"
                    value={formData.order_status}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                    style={{'--tw-ring-color': 'rgb(7,72,94)'}}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderForm;