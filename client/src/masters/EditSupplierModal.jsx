import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, Save, Building2 } from "lucide-react";

const EditSupplierModal = ({ supplier, onClose, onUpdate }) => {
  const [form, setForm] = useState(supplier);

  useEffect(() => {
    setForm(supplier);
  }, [supplier]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:5000/api/master/supplier/edit/${supplier._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );
      if (res.ok) {
        const data = await res.json();
        onUpdate(data.supplier);
        onClose();
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (!supplier) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        {/* Header */}
        <div
          className="flex justify-between items-center px-6 py-4"
          style={{ backgroundColor: "#225D71" }}
        >
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-white" />
            <h2 className="text-lg font-semibold text-white">Edit Supplier</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-5 p-6"
          style={{ backgroundColor: "#CDE1E6" }}
        >
          {/* Supplier Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Supplier Name
            </label>
            <input
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1
                focus:ring-2 focus:ring-[#225D71] focus:border-[#225D71] outline-none
                transition shadow-sm"
              placeholder="Enter name"
            />
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Person
            </label>
            <input
              name="contactPerson"
              value={form.contactPerson || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1
                focus:ring-2 focus:ring-[#225D71] focus:border-[#225D71] outline-none
                transition shadow-sm"
              placeholder="Enter contact person"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              name="phone"
              value={form.phone || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1
                focus:ring-2 focus:ring-[#225D71] focus:border-[#225D71] outline-none
                transition shadow-sm"
              placeholder="Enter phone number"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              value={form.email || ""}
              onChange={handleChange}
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1
                focus:ring-2 focus:ring-[#225D71] focus:border-[#225D71] outline-none
                transition shadow-sm"
              placeholder="Enter email"
            />
          </div>

          {/* GST */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              GST Number
            </label>
            <input
              name="gstNumber"
              value={form.gstNumber || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1
                focus:ring-2 focus:ring-[#225D71] focus:border-[#225D71] outline-none
                transition shadow-sm"
              placeholder="Enter GST number"
            />
          </div>

          {/* PAN */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              PAN Number
            </label>
            <input
              name="panNumber"
              value={form.panNumber || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1
                focus:ring-2 focus:ring-[#225D71] focus:border-[#225D71] outline-none
                transition shadow-sm"
              placeholder="Enter PAN number"
            />
          </div>

          {/* Status */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={form.status || "active"}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1
                focus:ring-2 focus:ring-[#225D71] focus:border-[#225D71] outline-none
                transition shadow-sm bg-white"
            >
              <option value="active">✅ Active</option>
              <option value="inactive">❌ Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-[#225D71]/20 hover:bg-[#225D71]/30
                text-[#225D71] font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#225D71] hover:bg-[#1f5362]
                text-white font-medium flex items-center gap-2 shadow-md transition"
            >
              <Save className="w-4 h-4" /> Update
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditSupplierModal;
