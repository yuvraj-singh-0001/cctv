import React, { useState, useEffect } from 'react';
import API_BASE_URL from "../components/apiconfig/api-config";
import { 
  Search, 
  RefreshCw, 
  ShoppingCart,
  Download,
  Printer,
  X,
  FileText,
  User,
  Phone,
  MapPin,
  Calendar,
  Mail,
  ArrowLeft
} from 'lucide-react';

function SalesOrdersList() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('');
  const [filterOrderStatus, setFilterOrderStatus] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [isInvoiceLoading, setIsInvoiceLoading] = useState(false);

  useEffect(() => {
    loadSalesOrders();
  }, []);

  const loadSalesOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/list`);
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders);
      } else {
        console.error('Error fetching sales orders:', data.message);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error loading sales orders:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  // View Invoice Function
  const viewInvoice = async (order) => {
    setSelectedOrder(order);
    setIsInvoiceLoading(true);
    
    try {
      // Use your existing order data for invoice
      setInvoiceData({
        ...order,
        invoice_number: `INV-${order.order_number}`,
        invoice_date: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error loading invoice:', error);
      // Fallback to order data
      setInvoiceData({
        ...order,
        invoice_number: `INV-${order.order_number}`,
        invoice_date: new Date().toISOString()
      });
    } finally {
      setIsInvoiceLoading(false);
    }
  };

  // Download Invoice PDF
  const downloadInvoice = async (orderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/invoice-pdf`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `invoice-${orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Invoice download failed. Please try again.');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Error downloading invoice. Please try again.');
    }
  };

  // Print Invoice
  const printInvoice = () => {
    window.print();
  };

  const closeInvoice = () => {
    setSelectedOrder(null);
    setInvoiceData(null);
  };

  // Rest of your existing functions
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_phone?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPaymentStatus = filterPaymentStatus === '' || order.payment_status === filterPaymentStatus;
    const matchesOrderStatus = filterOrderStatus === '' || order.order_status === filterOrderStatus;
    
    return matchesSearch && matchesPaymentStatus && matchesOrderStatus;
  });

  const paymentStatusOptions = ['Pending', 'Paid', 'Cancelled'];
  const orderStatusOptions = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 text-xs';
      case 'Paid': return 'bg-green-100 text-green-800 text-xs';
      case 'Cancelled': return 'bg-red-100 text-red-800 text-xs';
      default: return 'bg-gray-100 text-gray-800 text-xs';
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-blue-100 text-blue-800 text-xs';
      case 'Shipped': return 'bg-purple-100 text-purple-800 text-xs';
      case 'Delivered': return 'bg-green-100 text-green-800 text-xs';
      case 'Cancelled': return 'bg-red-100 text-red-800 text-xs';
      default: return 'bg-gray-100 text-gray-800 text-xs';
    }
  };

  const clearFilters = () => {
    setFilterPaymentStatus('');
    setFilterOrderStatus('');
    setSearchTerm('');
  };

  // Invoice Component
  const InvoiceModal = () => {
    if (!selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <FileText size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-gray-800">Invoice Preview</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadInvoice(selectedOrder._id)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors shadow-sm"
              >
                <Download size={16} />
                Download PDF
              </button>
              <button
                onClick={printInvoice}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Printer size={16} />
                Print
              </button>
              <button
                onClick={closeInvoice}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Invoice Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            {isInvoiceLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Loading invoice...</p>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-white">
                {/* Invoice Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="md:col-span-2">
                    <h1 className="text-3xl font-bold text-blue-600 mb-2">INVOICE</h1>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Invoice #:</span>
                        <p className="font-semibold text-gray-800">INV-{selectedOrder.order_number}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Invoice Date:</span>
                        <p className="font-semibold text-gray-800">{formatDate(new Date().toISOString())}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Order #:</span>
                        <p className="font-semibold text-gray-800">{selectedOrder.order_number}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Order Date:</span>
                        <p className="font-semibold text-gray-800">{formatDate(selectedOrder.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl font-bold mx-auto md:mx-0 md:ml-auto shadow-lg">
                      LOGO
                    </div>
                  </div>
                </div>

                {/* Company and Customer Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 text-lg border-b pb-2">From:</h3>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="font-bold text-blue-700 text-lg">Your Company Name</p>
                      <p className="text-gray-700">123 Business Street, Industrial Area</p>
                      <p className="text-gray-700">Mumbai, Maharashtra - 400001</p>
                      <p className="text-gray-700">📞 +91 98765 43210</p>
                      <p className="text-gray-700">📧 company@example.com</p>
                      <p className="text-gray-700 text-sm mt-2">GSTIN: 07AABCU9603R1ZM</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 text-lg border-b pb-2">Bill To:</h3>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-start gap-2 mb-2">
                        <User size={16} className="text-green-600 mt-1 flex-shrink-0" />
                        <p className="font-bold text-green-700 text-lg">{selectedOrder.customer_name}</p>
                      </div>
                      <div className="flex items-start gap-2 mb-2">
                        <Mail size={16} className="text-green-600 mt-1 flex-shrink-0" />
                        <p className="text-gray-700">{selectedOrder.customer_email}</p>
                      </div>
                      <div className="flex items-start gap-2 mb-2">
                        <Phone size={16} className="text-green-600 mt-1 flex-shrink-0" />
                        <p className="text-gray-700">{selectedOrder.customer_phone}</p>
                      </div>
                      {selectedOrder.customer_address && (
                        <div className="flex items-start gap-2">
                          <MapPin size={16} className="text-green-600 mt-1 flex-shrink-0" />
                          <p className="text-gray-700">{selectedOrder.customer_address}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Status */}
                <div className="mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 font-medium">Order Status</p>
                        <span className={`inline-flex px-3 py-1 rounded-full ${getOrderStatusColor(selectedOrder.order_status)}`}>
                          {selectedOrder.order_status}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Payment Status</p>
                        <span className={`inline-flex px-3 py-1 rounded-full ${getPaymentStatusColor(selectedOrder.payment_status)}`}>
                          {selectedOrder.payment_status}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Payment Method</p>
                        <p className="font-semibold text-gray-800">Online Payment</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Due Date</p>
                        <p className="font-semibold text-gray-800">{formatDate(new Date().toISOString())}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3 text-lg border-b pb-2">Order Items</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700 border-r border-gray-200">Product</th>
                          <th className="px-4 py-3 text-center font-semibold text-gray-700 border-r border-gray-200 w-20">Qty</th>
                          <th className="px-4 py-3 text-right font-semibold text-gray-700 border-r border-gray-200 w-32">Price</th>
                          <th className="px-4 py-3 text-right font-semibold text-gray-700 w-32">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {(selectedOrder.items || []).map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 border-r border-gray-200">
                              <p className="font-medium text-gray-800">
                                {item.product?.productName || `Item ${index + 1}`}
                              </p>
                              {item.product?.description && (
                                <p className="text-gray-500 text-xs mt-1">{item.product.description}</p>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center border-r border-gray-200">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                {item.quantity}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right border-r border-gray-200 font-medium text-gray-800">
                              {formatCurrency(item.price)}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-green-600">
                              {formatCurrency(item.quantity * item.price)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Total Section */}
                <div className="flex justify-end">
                  <div className="w-full md:w-80">
                    <div className="space-y-3 bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Subtotal:</span>
                        <span className="font-semibold text-gray-800">{formatCurrency(selectedOrder.subtotal)}</span>
                      </div>
                      {selectedOrder.tax > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Tax:</span>
                          <span className="font-semibold text-gray-800">{formatCurrency(selectedOrder.tax)}</span>
                        </div>
                      )}
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Discount:</span>
                          <span className="font-semibold text-red-600">-{formatCurrency(selectedOrder.discount)}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-300 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg text-gray-800">Grand Total:</span>
                          <span className="font-bold text-lg text-green-600">
                            {formatCurrency(selectedOrder.grand_total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-300 text-center text-gray-600 text-sm">
                  <p className="font-medium mb-2">Thank you for your business!</p>
                  <p>If you have any questions, please contact us at support@company.com or call +91 98765 43210</p>
                  <p className="mt-2 text-xs">This is a computer-generated invoice and does not require a physical signature.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Sales Orders</h1>
              <p className="text-gray-600 mt-1">Manage and track all customer orders • {orders.length} orders</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadSalesOrders}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order number, customer name, email or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <select
                value={filterPaymentStatus}
                onChange={(e) => setFilterPaymentStatus(e.target.value)}
                className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">All Payments</option>
                {paymentStatusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <select
                value={filterOrderStatus}
                onChange={(e) => setFilterOrderStatus(e.target.value)}
                className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">All Status</option>
                {orderStatusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              {(filterPaymentStatus || filterOrderStatus || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 whitespace-nowrap transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        {(filterPaymentStatus || filterOrderStatus || searchTerm) && (
          <div className="mb-4">
            <p className="text-sm text-blue-600 font-medium">
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm || filterPaymentStatus || filterOrderStatus ? 'No orders found' : 'No orders yet'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm || filterPaymentStatus || filterOrderStatus 
                ? 'Try adjusting your search criteria or clear filters to see all orders.'
                : 'Orders will appear here once they are created.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-3">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    {/* Order Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <ShoppingCart size={18} className="text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-base font-semibold text-gray-800 truncate">
                              {order.order_number}
                            </h3>
                            <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                          {order.payment_status}
                        </span>
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.order_status)}`}>
                          {order.order_status}
                        </span>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-600 text-xs font-medium">Customer</p>
                        <p className="font-semibold text-gray-800 truncate">{order.customer_name}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs font-medium">Phone</p>
                        <p className="font-semibold text-gray-800">{order.customer_phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs font-medium">Total Amount</p>
                        <p className="font-bold text-green-600">{formatCurrency(order.grand_total)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs font-medium">Items</p>
                        <p className="font-semibold text-gray-800">{(order.items || []).length} items</p>
                      </div>
                    </div>

                    {/* Invoice Button */}
                    <div className="flex justify-center pt-3 border-t border-gray-100">
                      <button
                        onClick={() => viewInvoice(order)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors w-full justify-center shadow-sm"
                      >
                        <FileText size={16} />
                        View Invoice
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Order Details</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Customer</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Items</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Amount</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Payment</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <ShoppingCart size={14} className="text-blue-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                {order.order_number}
                              </div>
                              <div className="text-gray-500 text-xs">{formatDate(order.createdAt)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800">{order.customer_name}</div>
                          <div className="text-gray-500 text-xs">{order.customer_phone}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-gray-800 font-medium">{(order.items || []).length} items</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-green-600">{formatCurrency(order.grand_total)}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-gray-800">{formatDate(order.createdAt)}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                            {order.payment_status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.order_status)}`}>
                            {order.order_status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => viewInvoice(order)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors shadow-sm"
                          >
                            <FileText size={14} />
                            Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      <InvoiceModal />
    </div>
  );
}

export default SalesOrdersList;