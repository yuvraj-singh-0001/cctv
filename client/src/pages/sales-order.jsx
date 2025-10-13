// src/pages/OrderForm.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API_BASE_URL from "../components/apiconfig/api-config";
import { 
  ShoppingCart, Save, X, User, Phone, Mail, MapPin,
  Package, DollarSign, Percent, Truck, CheckCircle, Plus, Trash2
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`);
        const data = await res.json();
        if (data.success) setProducts(data.products);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const subtotal = formData.items.reduce((sum, i) => sum + (i.total || 0), 0);
    const taxAmount = (subtotal * formData.tax) / 100;
    setFormData(prev => ({
      ...prev,
      subtotal,
      grand_total: Math.max(0, subtotal + taxAmount - prev.discount)
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
      const selected = products.find(p => p.id === value);
      if (selected)
        updatedItems[index] = {
          product: selected.id,
          price: selected.price,
          quantity: 1,
          total: selected.price
        };
      else updatedItems[index][field] = value;
    } else {
      updatedItems[index][field] =
        field === 'quantity' || field === 'price'
          ? parseFloat(value) || 0
          : value;
      if (field === 'quantity' || field === 'price')
        updatedItems[index].total =
          updatedItems[index].quantity * updatedItems[index].price;
    }
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const addItem = () =>
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { product: '', quantity: 1, price: 0, total: 0 }]
    }));

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.customer_name,
          customer_phone: formData.customer_phone,
          customer_email: formData.customer_email,
          customer_address: formData.customer_address,
          items: formData.items,
          subtotal: formData.subtotal,
          tax: formData.tax,
          discount: formData.discount,
          grand_total: formData.grand_total,
          payment_status: formData.payment_status,
          order_status: formData.order_status
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error');
      if (data.success) {
        setSubmitSuccess(true);
        window.dispatchEvent(
          new CustomEvent('orderAdded', { detail: { orderId: data.orderId } })
        );
        setTimeout(() => {
          setSubmitSuccess(false);
          resetForm();
        }, 2000);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
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
  };

  return (
    <div className="w-full px-0 sm:px-0">
      <div className="w-full max-w-full mx-auto">
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-2 p-2 bg-green-50 border border-green-200 rounded flex items-center gap-2 text-sm"
          >
            <CheckCircle size={16} className="text-green-600" /> Order created
            successfully!
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow overflow-hidden"
        >
          {/* ✅ Removed Top Buttons - Only Heading Remains */}
          <div className="px-3 py-2 border-b flex justify-between items-center bg-teal-100">
            <h2 className="text-md font-semibold text-teal-900">
              Order Information
            </h2>
          </div>

          <form id="order-form" onSubmit={handleSubmit} className="p-2 space-y-3">
            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium text-teal-900">Name *</label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-teal-900">Phone *</label>
                <input
                  type="tel"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-teal-900">Email</label>
                <input
                  type="email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-teal-900">Address *</label>
                <textarea
                  name="customer_address"
                  value={formData.customer_address}
                  onChange={handleChange}
                  rows="1"
                  className="w-full p-2 border rounded text-sm"
                  required
                />
              </div>
            </div>

            {/* Products Section */}
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 p-2 border rounded items-end">
                <div className="col-span-12 md:col-span-5">
                  <label className="text-sm font-medium text-teal-900">Product</label>
                  <select
                    value={item.product}
                    onChange={e => handleItemChange(index, 'product', e.target.value)}
                    className="w-full p-2 border rounded text-sm"
                    required
                  >
                    <option value="">Select</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} - ₹{p.price}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-6 md:col-span-2">
                  <label className="text-sm font-medium text-teal-900">Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                    className="w-full p-2 border rounded text-sm"
                    required
                  />
                </div>
                <div className="col-span-6 md:col-span-2">
                  <label className="text-sm font-medium text-teal-900">Price</label>
                  <input
                    type="number"
                    value={item.price}
                    readOnly={item.product}
                    className="w-full p-2 border rounded text-sm"
                  />
                </div>
                <div className="col-span-8 md:col-span-2">
                  <label className="text-sm font-medium text-teal-900">Total</label>
                  <input
                    type="text"
                    value={`₹${item.total.toFixed(2)}`}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-50 text-sm"
                  />
                </div>
                <div className="col-span-4 md:col-span-1">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    disabled={formData.items.length === 1}
                    className="w-full p-2 bg-red-50 text-red-600 rounded disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1 px-2 py-1 bg-teal-900 text-white rounded text-sm"
            >
              <Plus size={14} /> Add Product
            </button>

            {/* Totals Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
              <div>
                <label className="text-teal-900">Subtotal</label>
                <input
                  type="text"
                  value={`₹${formData.subtotal.toFixed(2)}`}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-50"
                />
              </div>
              <div>
                <label className="text-teal-900">Tax %</label>
                <input
                  type="number"
                  name="tax"
                  value={formData.tax}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="text-teal-900">Discount ₹</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="text-teal-900">Grand Total</label>
                <input
                  type="text"
                  value={`₹${formData.grand_total.toFixed(2)}`}
                  readOnly
                  className="w-full p-2 border-2 rounded bg-gray-100 font-semibold"
                />
              </div>
            </div>

            {/* Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <label className="text-teal-900">Payment Status</label>
                <select
                  name="payment_status"
                  value={formData.payment_status}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option>Pending</option>
                  <option>Paid</option>
                  <option>Cancelled</option>
                </select>
              </div>
              <div>
                <label className="text-teal-900">Order Status</label>
                <select
                  name="order_status"
                  value={formData.order_status}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>

            {/* ✅ Bottom Buttons Only */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mt-4 border-t pt-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-teal-900">Order Number</label>
                <input
                  type="text"
                  name="order_number"
                  value={formData.order_number}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-50 text-sm"
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-teal-900 text-teal-900 rounded-lg font-medium 
                             hover:bg-teal-50 flex items-center gap-1 transition-all duration-200 w-full md:w-auto"
                >
                  <X size={16} /> Clear
                </button>

                <button
                  type="submit"
                  form="order-form"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gradient-to-r from-teal-700 to-teal-900 hover:from-teal-800 hover:to-teal-950
                             text-white font-medium rounded-lg shadow-md transition-all duration-200 
                             flex items-center justify-center gap-2 w-full md:w-auto"
                >
                  {isSubmitting ? (
                    <>Creating...</>
                  ) : (
                    <>
                      <Save size={16} /> Submit Order
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderForm;
