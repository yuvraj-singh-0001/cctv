import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API_BASE_URL from "../components/apiconfig/api-config";
import { Save, FileText, Package, DollarSign, ClipboardList, CheckCircle } from "lucide-react";

function DebitNoteForm() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [reason, setReason] = useState("");
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Fetch all Sales Orders for dropdown
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/orders/list`);
        const data = await res.json();
        if (data.success) setOrders(data.orders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, []);

  // 🔹 When user selects order, fetch details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!selectedOrder) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/orders/${selectedOrder}`);
        const data = await res.json();
        if (data.success) {
          setOrderDetails(data.order);
          setItems(
            data.order.items.map((it) => ({
              product: it.product?._id,
              name: it.product?.product_name,
              quantity: it.quantity,
              price: it.price,
              total: it.quantity * it.price,
            }))
          );
          setTotalAmount(data.order.grand_total);
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
      }
    };
    fetchOrderDetails();
  }, [selectedOrder]);

  // 🔹 Handle quantity or price edit
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = Number(value);
    updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].price;
    setItems(updatedItems);
    const newTotal = updatedItems.reduce((sum, i) => sum + i.total, 0);
    setTotalAmount(newTotal);
  };

  // 🔹 Submit form to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder || !reason) {
      setMessage("⚠️ Please select an order and enter a reason.");
      return;
    }

    setLoading(true);
    setMessage("");

    const payload = {
      debit_note_number: `DN-${Date.now()}`,
      related_order: selectedOrder,
      reason,
      items: items.map((i) => ({
        product: i.product,
        quantity: i.quantity,
        price: i.price,
        total: i.total,
      })),
      total_amount: totalAmount,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/debit-notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setMessage("✅ Debit Note created successfully!");
        setSelectedOrder("");
        setOrderDetails(null);
        setItems([]);
        setReason("");
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Error creating debit note:", err);
      setMessage("❌ Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-md mt-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <FileText /> Create Debit Note
      </h2>

      {/* Order Selection */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="font-medium">Select Related Order</label>
          <select
            className="w-full border rounded-lg p-2"
            value={selectedOrder}
            onChange={(e) => setSelectedOrder(e.target.value)}
          >
            <option value="">-- Select Order --</option>
            {orders.map((order) => (
              <option key={order._id} value={order._id}>
                {order.order_number} - {order.customer_name}
              </option>
            ))}
          </select>
        </div>

        {orderDetails && (
          <div>
            <label className="font-medium">Customer</label>
            <input
              type="text"
              readOnly
              className="w-full border rounded-lg p-2 bg-gray-100"
              value={orderDetails.customer_name}
            />
          </div>
        )}
      </div>

      {/* Reason Field */}
      <div className="mb-4">
        <label className="font-medium">Reason for Debit Note</label>
        <textarea
          className="w-full border rounded-lg p-2"
          rows="2"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason (e.g., product damage, return, etc.)"
        />
      </div>

      {/* Item Table */}
      {items.length > 0 && (
        <div className="overflow-x-auto mb-4">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Product</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-2 border">{item.name}</td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                      className="w-20 border rounded p-1"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleItemChange(idx, "price", e.target.value)}
                      className="w-24 border rounded p-1"
                    />
                  </td>
                  <td className="p-2 border">{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Total */}
      <div className="flex justify-end text-lg font-semibold mb-4">
        <DollarSign className="mr-1" /> Total: ₹{totalAmount.toFixed(2)}
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2"
      >
        <Save size={18} /> {loading ? "Saving..." : "Save Debit Note"}
      </button>

      {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
    </motion.div>
  );
}

export default DebitNoteForm;
