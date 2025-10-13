import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Building2,
  Phone,
  CreditCard,
  Landmark,
  Save,
  X,
  CheckCircle,
  List,
} from "lucide-react";
import SupplierList from "../masters/supplier-list";
import API_BASE_URL from "../components/apiconfig/api-config";

const SupplierForm = () => {
  const [currentView, setCurrentView] = useState("form");
  const [form, setForm] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    gstNumber: "",
    panNumber: "",
    bankAccount: "",
    ifscCode: "",
    branch: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const required = [
      "name",
      "contactPerson",
      "phone",
      "email",
      "address",
      "gstNumber",
      "panNumber",
      "bankAccount",
      "ifscCode",
      "branch",
    ];

    for (const field of required) {
      if (!form[field]?.trim()) {
        alert("Please fill all required fields.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/master/supplier/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          setForm({
            name: "",
            contactPerson: "",
            phone: "",
            email: "",
            address: "",
            gstNumber: "",
            panNumber: "",
            bankAccount: "",
            ifscCode: "",
            branch: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }, 2000);
      } else {
        alert(data.message || "Failed to add supplier.");
      }
    } catch (err) {
      alert("Server error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Compact + Animated Form
  const renderForm = () => (
    <motion.div
      className="w-full max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="flex justify-between items-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2">
          <Building2 size={22} className="text-[rgb(7,72,94)]" />
          <h1 className="text-xl font-bold text-[rgb(7,72,94)]">
            Supplier Form
          </h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentView("list")}
          className="flex items-center gap-2 px-3 py-1.5 text-sm border-2 rounded-md text-[rgb(7,72,94)] border-[rgb(7,72,94)] hover:bg-[rgb(7,72,94)] hover:text-white transition-all"
        >
          <List size={16} /> Show Suppliers
        </motion.button>
      </motion.div>

      {/* Success Message */}
      {submitSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-3 p-2 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm flex items-center gap-2"
        >
          <CheckCircle size={16} /> Supplier added successfully!
        </motion.div>
      )}

      {/* Main Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-5 space-y-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {/* === Basic + Contact Details === */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <User size={18} className="text-[rgb(7,72,94)]" />
            <h3 className="text-sm font-semibold text-[rgb(7,72,94)]">
              Basic & Contact Details
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Supplier / Company Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., Shivam Enterprises"
            />
            <Input
              label="Contact Person"
              name="contactPerson"
              value={form.contactPerson}
              onChange={handleChange}
              placeholder="e.g., Yuvraj Singh"
            />
            <Input
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="9876543210"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="supplier@email.com"
            />
          </div>
          <TextArea
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="e.g., B30, Codecampfer, Noida"
            className="mt-2 mb-3" // <-- extra spacing for Address
          />
        </motion.div>

        {/* === Tax Details === */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <CreditCard size={18} className="text-[rgb(7,72,94)]" />
            <h3 className="text-sm font-semibold text-[rgb(7,72,94)]">
              Tax Details
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="GST Number"
              name="gstNumber"
              value={form.gstNumber}
              onChange={handleChange}
              placeholder="22AAAAA0000A1Z5"
            />
            <Input
              label="PAN Number"
              name="panNumber"
              value={form.panNumber}
              onChange={handleChange}
              placeholder="ABCDE1234F"
            />
          </div>
        </motion.div>

        {/* === Bank Details === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Landmark size={18} className="text-[rgb(7,72,94)]" />
            <h3 className="text-sm font-semibold text-[rgb(7,72,94)]">
              Bank Details
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              label="Account Number"
              name="bankAccount"
              value={form.bankAccount}
              onChange={handleChange}
              placeholder="1234567890"
            />
            <Input
              label="IFSC Code"
              name="ifscCode"
              value={form.ifscCode}
              onChange={handleChange}
              placeholder="SBIN0000456"
            />
            <Input
              label="Branch"
              name="branch"
              value={form.branch}
              onChange={handleChange}
              placeholder="Andheri West, Mumbai"
            />
          </div>
        </motion.div>

        {/* === Buttons === */}
        <motion.div
          className="flex justify-end gap-3 pt-3 border-t"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              setForm({
                name: "",
                contactPerson: "",
                phone: "",
                email: "",
                address: "",
                gstNumber: "",
                panNumber: "",
                bankAccount: "",
                ifscCode: "",
                branch: "",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              })
            }
            className="px-4 py-1.5 text-sm rounded-md border-2 border-[rgb(7,72,94)] text-[rgb(7,72,94)] hover:bg-[rgb(7,72,94)] hover:text-white transition-all flex items-center gap-1"
          >
            <X size={14} /> Clear
          </motion.button>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="px-5 py-1.5 text-sm rounded-md text-white bg-[rgb(7,72,94)] hover:bg-[rgb(5,60,80)] transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={14} /> Save
              </>
            )}
          </motion.button>
        </motion.div>
      </motion.form>
    </motion.div>
  );

  const renderList = () => (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-[rgb(7,72,94)]">
          Supplier List
        </h1>
        <button
          onClick={() => setCurrentView("form")}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md text-white bg-[rgb(7,72,94)] hover:bg-[rgb(5,60,80)]"
        >
          <User size={16} /> Add Supplier
        </button>
      </div>
      <SupplierList />
    </motion.div>
  );

  return currentView === "form" ? renderForm() : renderList();
};

// 🔹 Reusable Input Components
const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-1">
      {label} *
    </label>
    <input
      {...props}
      className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent focus:ring-[rgb(7,72,94)] transition-all"
    />
  </div>
);

const TextArea = ({ label, className, ...props }) => (
  <div className={className}>
    <label className="block text-xs font-medium text-gray-700 mb-1">
      {label} *
    </label>
    <textarea
      {...props}
      rows={2}
      className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent focus:ring-[rgb(7,72,94)] transition-all"
    />
  </div>
);

export default SupplierForm;
