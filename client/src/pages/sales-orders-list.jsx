import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API_BASE_URL from "../components/apiconfig/api-config";
import { 
  Search, 
  RefreshCw, 
  ShoppingCart,
  User,
  DollarSign,
  Phone,
  MapPin
} from 'lucide-react';

function SalesOrdersList() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('');
  const [filterOrderStatus, setFilterOrderStatus] = useState('');

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
        console.log('✅ Orders loaded:', data.orders);
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
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-4 rounded-full animate-spin mx-auto" style={{borderTopColor: 'rgb(7,72,94)'}}></div>
          <p className="mt-4" style={{color: 'rgb(7,72,94)'}}>
            Loading sales orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-10 sm:pb-2">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-1"
      >
        <div className="flex flex-row justify-between items-center gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold mt-2" style={{color: 'rgb(7,72,94)'}}>
              Sales Orders
            </h1>
            <p className="text-gray-600 mt-1">View and manage all sales orders ({orders.length} orders)</p>
          </div>
          <div className="hidden sm:flex gap-2">
            <button
              onClick={loadSalesOrders}
              className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg"
              style={{ backgroundColor: 'rgb(7,72,94)', color: 'white' }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Refresh Button */}
      <div className="sm:hidden mb-4 px-3">
        <button
          onClick={loadSalesOrders}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg"
          style={{ backgroundColor: 'rgb(7,72,94)', color: 'white' }}
        >
          <RefreshCw size={16} />
          Refresh Orders
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row items-center gap-4 px-4 py-3 border rounded-lg bg-gray-50">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number, customer name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
              style={{'--tw-ring-color': 'rgb(7,72,94)'}}
            />
          </div>

          {/* Payment Status Filter */}
          <div className="w-full sm:w-40">
            <select
              value={filterPaymentStatus}
              onChange={(e) => setFilterPaymentStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
              style={{'--tw-ring-color': 'rgb(7,72,94)'}}
            >
              <option value="">All Payment</option>
              {paymentStatusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Order Status Filter */}
          <div className="w-full sm:w-40">
            <select
              value={filterOrderStatus}
              onChange={(e) => setFilterOrderStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
              style={{'--tw-ring-color': 'rgb(7,72,94)'}}
            >
              <option value="">All Order Status</option>
              {orderStatusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Orders Display */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b" style={{backgroundColor: '#CDE1E6'}}>
            <h2 className="text-lg font-semibold" style={{color: 'rgb(7,72,94)'}}>
              Sales Orders
            </h2>
          </div>
          <div className="p-12 text-center">
            <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterPaymentStatus || filterOrderStatus ? 'No orders match your search' : 'No sales orders found'}
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterPaymentStatus || filterOrderStatus 
                ? 'Try adjusting your search terms or filters.' 
                : 'Sales orders will appear here once created.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b" style={{backgroundColor: '#CDE1E6'}}>
            <h2 className="text-lg font-semibold" style={{color: 'rgb(7,72,94)'}}>
              Sales Orders ({filteredOrders.length} orders)
            </h2>
          </div>

          {/* Mobile Card View */}
          <div className="block lg:hidden">
            <div className="grid grid-cols-1 gap-4 p-4">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                        <ShoppingCart size={20} className="text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {order.order_number || `ORD-${order._id?.slice(-6)}`}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                        {order.payment_status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.order_status)}`}>
                        {order.order_status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-gray-400" />
                      <span className="text-gray-600">Customer:</span>
                      <span className="font-medium truncate">{order.customer_name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-400" />
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium truncate">{order.customer_phone}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign size={14} className="text-gray-400" />
                      <span className="text-gray-600">Total:</span>
                      <span className="font-bold" style={{color: 'rgb(7,72,94)'}}>
                        {formatCurrency(order.grand_total)}
                      </span>
                    </div>

                    <div className="pt-2 border-t">
                      <span className="text-gray-600 text-xs">Items ({order.items?.length || 0}):</span>
                      <div className="mt-1 space-y-1">
                        {(order.items || []).slice(0, 2).map((item, index) => (
                          <div key={index} className="flex justify-between text-xs">
                            <span className="truncate flex-1">
                              {item.product?.productName || `Item ${index + 1}`}
                            </span>
                            <span className="ml-2 text-gray-500">
                              {item.quantity} × {formatCurrency(item.price)}
                            </span>
                          </div>
                        ))}
                        {(order.items || []).length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{(order.items || []).length - 2} more items
                          </div>
                        )}
                      </div>
                    </div>

                    {order.customer_address && (
                      <div className="flex items-start gap-2 pt-2 border-t">
                        <MapPin size={14} className="text-gray-400 mt-0.5" />
                        <span className="text-gray-600 text-xs">Address:</span>
                        <span className="text-xs text-gray-500 flex-1 truncate">{order.customer_address}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: 'rgb(7,72,94)'}}>
                    Order Details
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: 'rgb(7,72,94)'}}>
                    Customer
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: 'rgb(7,72,94)'}}>
                    Items
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: 'rgb(7,72,94)'}}>
                    Amount
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: 'rgb(7,72,94)'}}>
                    Date
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: 'rgb(7,72,94)'}}>
                    Payment
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: 'rgb(7,72,94)'}}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr 
                    key={order._id}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-2">
                          <ShoppingCart size={16} className="text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                            {order.order_number || `ORD-${order._id?.slice(-6)}`}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order._id?.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                        {order.customer_name}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-32">
                        {order.customer_phone}
                      </div>
                      <div className="text-xs text-gray-400 truncate max-w-32">
                        {order.customer_email}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-sm text-gray-500">
                        {(order.items || []).length} items
                      </div>
                      <div className="text-xs text-gray-400 truncate max-w-40">
                        {(order.items || []).slice(0, 2).map(item => 
                          item.product?.productName || 'Product'
                        ).join(', ')}
                        {(order.items || []).length > 2 && '...'}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.grand_total)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Subtotal: {formatCurrency(order.subtotal)}
                      </div>
                      {order.tax > 0 && (
                        <div className="text-xs text-gray-500">
                          Tax: {formatCurrency(order.tax)}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.order_status)}`}>
                        {order.order_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalesOrdersList;