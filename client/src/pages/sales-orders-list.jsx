import React, { useState, useEffect } from 'react';
import { 
  Search, 
  RefreshCw, 
  ShoppingCart,
  FileText,
  ChevronDown
} from 'lucide-react';
import API_BASE_URL from "../components/apiconfig/api-config";
import InvoiceModal from "../pages/InvoiceModal";

function SalesOrdersList() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('');
  const [filterOrderStatus, setFilterOrderStatus] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
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
      // You can add any additional invoice processing here
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
    } catch (error) {
      console.error('Error loading invoice:', error);
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
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

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
      case 'Pending': return 'bg-red-200 text-[#856404] text-xs';
      case 'Paid': return 'bg-[#D1ECF1] text-[#0C5460] text-xs';
      case 'Cancelled': return 'bg-[#F8D7DA] text-[#721C24] text-xs';
      default: return 'bg-gray-100 text-gray-800 text-xs';
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-[#CCE5FF] text-[#004085] text-xs';
      case 'Shipped': return 'bg-[#E2E3E5] text-[#383D41] text-xs';
      case 'Delivered': return 'bg-[#D4EDDA] text-[#155724] text-xs';
      case 'Cancelled': return 'bg-[#F8D7DA] text-[#721C24] text-xs';
      default: return 'bg-gray-100 text-gray-800 text-xs';
    }
  };

  const clearFilters = () => {
    setFilterPaymentStatus('');
    setFilterOrderStatus('');
    setSearchTerm('');
  };

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-[#7ED8F6] border-t-[#07485E] rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-4">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        
        {/* Header - Compact */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-xl font-bold text-[#07485E]">Sales Orders</h1>
              <p className="text-sm text-gray-600"> Manage and track all customer orders  {orders.length}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadSalesOrders}
                className="flex items-center gap-1 px-3 py-2 bg-[#07485E] text-white rounded text-sm hover:bg-[#06374a] transition-colors"
              >
                <RefreshCw size={14} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters - Compact */}
        <div className="mb-4 space-y-2">
          <div className="bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-2 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#7ED8F6] focus:border-[#07485E] transition-colors"
                />
              </div>
              
              <select
                value={filterPaymentStatus}
                onChange={(e) => setFilterPaymentStatus(e.target.value)}
                className="px-2 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#7ED8F6] focus:border-[#07485E] transition-colors"
              >
                <option value="">All Payments</option>
                {paymentStatusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <select
                value={filterOrderStatus}
                onChange={(e) => setFilterOrderStatus(e.target.value)}
                className="px-2 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#7ED8F6] focus:border-[#07485E] transition-colors"
              >
                <option value="">All Status</option>
                {orderStatusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              {(filterPaymentStatus || filterOrderStatus || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-gray-600 border border-gray-300 rounded text-sm hover:bg-gray-50 whitespace-nowrap transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        {(filterPaymentStatus || filterOrderStatus || searchTerm) && (
          <div className="mb-3">
            <p className="text-sm text-[#07485E]">
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
          </div>
        )}

        {/* Orders */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center shadow-sm">
            <ShoppingCart size={32} className="mx-auto text-gray-400 mb-2" />
            <h3 className="text-base font-medium text-[#07485E] mb-1">
              {searchTerm || filterPaymentStatus || filterOrderStatus ? 'No orders found' : 'No orders yet'}
            </h3>
            <p className="text-sm text-gray-500">
              {searchTerm || filterPaymentStatus || filterOrderStatus 
                ? 'Try adjusting your search'
                : 'Orders will appear here once created'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-2">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div 
                    className="p-3 cursor-pointer"
                    onClick={() => toggleOrderExpansion(order._id)}
                  >
                    {/* Order Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-8 h-8 rounded-lg bg-[#E6F7FE] flex items-center justify-center flex-shrink-0">
                            <ShoppingCart size={14} className="text-[#07485E]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-semibold text-[#07485E] truncate">
                              {order.order_number || `ORD-${order._id?.slice(-6)}`}
                            </h3>
                            <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-2">
                        <span className={`px-2 py-1 rounded ${getPaymentStatusColor(order.payment_status)}`}>
                          {order.payment_status}
                        </span>
                        <span className={`px-2 py-1 rounded ${getOrderStatusColor(order.order_status)}`}>
                          {order.order_status}
                        </span>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-gray-600">Customer</p>
                        <p className="font-medium text-[#07485E] truncate">{order.customer_name}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Phone</p>
                        <p className="font-medium text-[#07485E]">{order.customer_phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total</p>
                        <p className="font-bold text-[#07485E]">{formatCurrency(order.grand_total)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Items</p>
                        <p className="font-medium text-[#07485E]">{(order.items || []).length}</p>
                      </div>
                    </div>

                    {/* Expand Button */}
                    <div className="flex justify-center mt-2 pt-2 border-t border-gray-100">
                      <button className="flex items-center gap-1 text-xs text-[#07485E] hover:text-[#06374a] transition-colors">
                        {expandedOrder === order._id ? 'Show Less' : 'View Details'}
                        <ChevronDown size={12} className={expandedOrder === order._id ? 'rotate-180' : ''} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedOrder === order._id && (
                    <div className="px-3 pb-3 border-t border-gray-100">
                      <div className="pt-2 space-y-2">
                        {/* Items List */}
                        <div>
                          <h4 className="text-xs font-medium text-[#07485E] mb-1">Order Items</h4>
                          <div className="space-y-1">
                            {(order.items || []).map((item, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-[#F9FAFB] rounded text-xs">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-[#07485E] truncate">
                                    {item.product?.productName || `Item ${index + 1}`}
                                  </p>
                                  <p className="text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-[#07485E]">{formatCurrency(item.price)}</p>
                                  <p className="text-gray-500">Total: {formatCurrency(item.quantity * item.price)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Amount Breakdown */}
                        <div className="grid grid-cols-2 gap-2 p-2 bg-[#E6F7FE] rounded text-xs">
                          <div>
                            <p className="text-gray-600">Subtotal</p>
                            <p className="font-semibold text-[#07485E]">{formatCurrency(order.subtotal)}</p>
                          </div>
                          {order.tax > 0 && (
                            <div>
                              <p className="text-gray-600">Tax</p>
                              <p className="font-semibold text-[#07485E]">{formatCurrency(order.tax)}</p>
                            </div>
                          )}
                          <div className="col-span-2 pt-1 border-t border-[#7ED8F6]">
                            <p className="text-gray-600">Grand Total</p>
                            <p className="font-bold text-[#07485E]">{formatCurrency(order.grand_total)}</p>
                          </div>
                        </div>

                        {/* Customer Address */}
                        {order.customer_address && (
                          <div>
                            <h4 className="text-xs font-medium text-[#07485E] mb-1">Address</h4>
                            <div className="flex items-start gap-1 p-2 bg-[#F9FAFB] rounded text-xs">
                              <MapPin size={12} className="text-gray-400 mt-0.5 flex-shrink-0" />
                              <p className="text-gray-700">{order.customer_address}</p>
                            </div>
                          </div>
                        )}

                        {/* Invoice Button */}
                        <div className="pt-2">
                          <button
                            onClick={() => viewInvoice(order)}
                            className="flex items-center gap-1 w-full justify-center px-3 py-2 bg-[#07485E] text-white rounded text-xs hover:bg-[#06374a] transition-colors"
                          >
                            <FileText size={12} />
                            View Invoice
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Table View - Compact */}
            <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-[#F9FAFB]">
                      <th className="px-3 py-2 text-left font-medium text-[#07485E]">Order</th>
                      <th className="px-3 py-2 text-left font-medium text-[#07485E]">Customer</th>
                      <th className="px-3 py-2 text-left font-medium text-[#07485E]">Items</th>
                      <th className="px-3 py-2 text-left font-medium text-[#07485E]">Amount</th>
                      <th className="px-3 py-2 text-left font-medium text-[#07485E]">Date</th>
                      <th className="px-3 py-2 text-left font-medium text-[#07485E]">Payment</th>
                      <th className="px-3 py-2 text-left font-medium text-[#07485E]">Status</th>
                      <th className="px-3 py-2 text-left font-medium text-[#07485E]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-[#F9FAFB] transition-colors">
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-[#E6F7FE] flex items-center justify-center">
                              <ShoppingCart size={12} className="text-[#07485E]" />
                            </div>
                            <div>
                              <div className="font-medium text-[#07485E]">
                                {order.order_number || `ORD-${order._id?.slice(-6)}`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="font-medium text-[#07485E]">{order.customer_name}</div>
                          <div className="text-gray-500 text-xs">{order.customer_phone}</div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="text-[#07485E]">{(order.items || []).length} items</div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="font-bold text-[#07485E]">{formatCurrency(order.subtotal)}</div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="text-[#07485E]">{formatDate(order.createdAt)}</div>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex px-2 py-1 rounded ${getPaymentStatusColor(order.payment_status)}`}>
                            {order.payment_status}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex px-2 py-1 rounded ${getOrderStatusColor(order.order_status)}`}>
                            {order.order_status}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <button
                            onClick={() => viewInvoice(order)}
                            className="flex items-center gap-1 px-2 py-1 bg-[#07485E] text-white rounded text-xs hover:bg-[#06374a] transition-colors"
                          >
                            <FileText size={12} />
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
      <InvoiceModal
        selectedOrder={selectedOrder}
        onClose={closeInvoice}
        onDownload={downloadInvoice}
        onPrint={printInvoice}
        isLoading={isInvoiceLoading}
      />
    </div>
  );
}

export default SalesOrdersList;