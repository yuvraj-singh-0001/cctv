import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Save, DollarSign, CalendarDays } from "lucide-react";
import API_BASE_URL from "../components/apiconfig/api-config";

function DebitNoteForm() {
  const [orderNumber, setOrderNumber] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [reason, setReason] = useState("");
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Fetch order by order number
  const fetchOrderByNumber = async () => {
    if (!orderNumber.trim()) return;

    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/list`);
      const data = await res.json();

      if (data.success) {
        const order = data.orders.find(
          (o) => o.order_number === orderNumber.trim()
        );

        if (order) {
          setOrderDetails(order);

          // ✅ Correct total calculation (discount %, tax % based)
          const mappedItems = order.items.map((it) => {
            const base = it.quantity * it.price;
            const discountAmt = (base * (it.discount || 0)) / 100;
            const afterDiscount = base - discountAmt;
            const taxAmt = (afterDiscount * (it.tax || 0)) / 100;
            const total = afterDiscount + taxAmt;

            return {
              product: it.product?._id,
              name: it.product?.product_name,
              quantity: it.quantity,
              price: it.price,
              discount: it.discount || 0,
              tax: it.tax || 0,
              total,
            };
          });

          const overallTotal = mappedItems.reduce(
            (sum, i) => sum + i.total,
            0
          );

          setItems(mappedItems);
          setTotalAmount(overallTotal);
        } else {
          setMessage("❌ Order not found for this order number.");
          setOrderDetails(null);
          setItems([]);
          setTotalAmount(0);
        }
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      setMessage("❌ Server error fetching order.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Save Debit Note
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderDetails || !reason) {
      setMessage("⚠️ Please enter order number and reason.");
      return;
    }

    const payload = {
      debit_note_number: `DN-${Date.now()}`,
      related_order: orderDetails._id,
      reason,
      items: items.map((i) => ({
        product: i.product,
        quantity: i.quantity,
        price: i.price,
        discount: i.discount,
        tax: i.tax,
        total: i.total,
      })),
      total_amount: totalAmount,
    };

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/debit-notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setMessage("✅ Debit Note created successfully!");
        setOrderNumber("");
        setOrderDetails(null);
        setItems([]);
        setReason("");
        setTotalAmount(0);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Error saving debit note:", err);
      setMessage("❌ Server error while saving.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-md mt-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <FileText /> Create Debit Note
      </h2>

      {/* 🔹 Order Search */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="font-medium">Enter Order Number</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchOrderByNumber()}
              placeholder="e.g. SO-1001"
              className="w-full border rounded-lg p-2"
            />
            <button
              onClick={fetchOrderByNumber}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Search
            </button>
          </div>
        </div>

        {orderDetails && (
          <div>
            <label className="font-medium">Customer Name</label>
            <input
              type="text"
              readOnly
              className="w-full border rounded-lg p-2 bg-gray-100"
              value={orderDetails.customer_name || ""}
            />
          </div>
        )}
      </div>

      {/* 🔹 Order Date */}
      {orderDetails && (
        <div className="flex items-center gap-2 mb-4 text-gray-700">
          <CalendarDays size={18} />
          <span>
            <strong>Order Date:</strong>{" "}
            {new Date(orderDetails.createdAt).toLocaleDateString("en-IN")}
          </span>
        </div>
      )}

      {/* 🔹 Reason */}
      {orderDetails && (
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
      )}

      {/* 🔹 Read-only Product Table */}
      {items.length > 0 && (
        <div className="overflow-x-auto mb-4">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr className="text-center">
                <th className="p-2 border">Product</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Discount (%)</th>
                <th className="p-2 border">Tax (%)</th>
                <th className="p-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="text-center">
                  <td className="p-2 border">{item.name}</td>
                  <td className="p-2 border">{item.quantity}</td>
                  <td className="p-2 border">₹{item.price.toFixed(2)}</td>
                  <td className="p-2 border text-blue-600">
                    {item.discount}%
                  </td>
                  <td className="p-2 border text-green-600">{item.tax}%</td>
                  <td className="p-2 border font-medium">
                    ₹{item.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔹 Total */}
      {items.length > 0 && (
        <div className="flex justify-end text-lg font-semibold mb-4">
          <DollarSign className="mr-1" /> Total: ₹{totalAmount.toFixed(2)}
        </div>
      )}

      {/* 🔹 Save Button */}
      {orderDetails && (
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <Save size={18} />
          {loading ? "Saving..." : "Save Debit Note"}
        </button>
      )}

      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      )}
    </motion.div>
  );
}

export default DebitNoteForm;
