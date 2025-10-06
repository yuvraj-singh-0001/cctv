import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Landmark,
  Save,
  X,
  CheckCircle,
  List,
} from "lucide-react";
import SupplierList from "../masters/supplier-list"; // ✅ List component
import API_BASE_URL from "../components/apiconfig/api-config";

const SupplierForm = () => {
  const [currentView, setCurrentView] = useState("form"); // "form" or "list"
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

  // 🟢 Handle field updates
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
      updatedAt: new Date().toISOString(),
    });
  };

  // 🟢 Handle form submit
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
        alert("Please fill all required fields in every section.");
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

  // 🧱 Form View
  const renderForm = () => (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex justify-between items-center"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white shadow-sm">
            <Building2 size={24} style={{ color: "rgb(7,72,94)" }} />
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "rgb(7,72,94)" }}
          >
            Supplier Form
          </h1>
        </div>

        <button
          onClick={() => setCurrentView("list")}
          className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all hover:shadow-lg"
          style={{
            backgroundColor: "white",
            color: "rgb(7,72,94)",
            border: "2px solid rgb(7,72,94)",
          }}
        >
          <List size={16} />
          Show Suppliers
        </button>
      </motion.div>

      <p className="text-gray-600 mb-6">
        Fill in supplier details to add them to the system.
      </p>

      {/* Success Alert */}
      {submitSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
        >
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-800 font-medium">
            Supplier added successfully!
          </span>
        </motion.div>
      )}

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b flex justify-between items-center"
          style={{ backgroundColor: "rgb(205,225,230)" }}
        >
          <h2
            className="text-lg font-semibold"
            style={{ color: "rgb(7,72,94)" }}
          >
            Supplier Information
          </h2>

          <div className="flex gap-3">
            <button
              type="button"
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
              className="px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md flex items-center gap-2"
              style={{
                backgroundColor: "white",
                color: "rgb(7,72,94)",
                border: "2px solid rgb(7,72,94)",
              }}
            >
              <X size={16} /> Clear
            </button>

            <button
              type="submit"
              form="supplier-form"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 transition-all hover:shadow-lg"
              style={{
                backgroundColor: "rgb(7,72,94)",
                color: "white",
                border: "2px solid rgb(7,72,94)",
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
        <form id="supplier-form" onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <User size={20} style={{ color: "rgb(7,72,94)" }} />
              <h3
                className="text-lg font-semibold"
                style={{ color: "rgb(7,72,94)" }}
              >
                Basic Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "rgb(7,72,94)" }}
                >
                  Supplier / Company Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g., Shivam Enterprises"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ "--tw-ring-color": "rgb(7,72,94)" }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "rgb(7,72,94)" }}
                >
                  Contact Person *
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={form.contactPerson}
                  onChange={handleChange}
                  placeholder="e.g., Yuvraj Singh"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ "--tw-ring-color": "rgb(7,72,94)" }}
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="border-t pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Phone size={20} style={{ color: "rgb(7,72,94)" }} />
              <h3
                className="text-lg font-semibold"
                style={{ color: "rgb(7,72,94)" }}
              >
                Contact Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "rgb(7,72,94)" }}
                >
                  Phone *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g., 9876543210"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ "--tw-ring-color": "rgb(7,72,94)" }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "rgb(7,72,94)" }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="e.g., supplier@email.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ "--tw-ring-color": "rgb(7,72,94)" }}
                />
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "rgb(7,72,94)" }}
              >
                Address *
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="e.g., B30, Codecampfer, Noida"
                rows={2}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ "--tw-ring-color": "rgb(7,72,94)" }}
              />
            </div>
          </div>

          {/* Tax Info */}
          <div className="border-t pt-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={20} style={{ color: "rgb(7,72,94)" }} />
              <h3
                className="text-lg font-semibold"
                style={{ color: "rgb(7,72,94)" }}
              >
                Tax Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "rgb(7,72,94)" }}
                >
                  GST Number *
                </label>
                <input
                  type="text"
                  name="gstNumber"
                  value={form.gstNumber}
                  onChange={handleChange}
                  placeholder="e.g., 22AAAAA0000A1Z5"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ "--tw-ring-color": "rgb(7,72,94)" }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "rgb(7,72,94)" }}
                >
                  PAN Number *
                </label>
                <input
                  type="text"
                  name="panNumber"
                  value={form.panNumber}
                  onChange={handleChange}
                  placeholder="e.g., ABCDE1234F"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ "--tw-ring-color": "rgb(7,72,94)" }}
                />
              </div>
            </div>
          </div>

          {/* Bank Info */}
          <div className="border-t pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Landmark size={20} style={{ color: "rgb(7,72,94)" }} />
              <h3
                className="text-lg font-semibold"
                style={{ color: "rgb(7,72,94)" }}
              >
                Bank Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "rgb(7,72,94)" }}
                >
                  Account Number *
                </label>
                <input
                  type="text"
                  name="bankAccount"
                  value={form.bankAccount}
                  onChange={handleChange}
                  placeholder="e.g., 1234567890"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ "--tw-ring-color": "rgb(7,72,94)" }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "rgb(7,72,94)" }}
                >
                  IFSC Code *
                </label>
                <input
                  type="text"
                  name="ifscCode"
                  value={form.ifscCode}
                  onChange={handleChange}
                  placeholder="e.g., SBIN0000456"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ "--tw-ring-color": "rgb(7,72,94)" }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "rgb(7,72,94)" }}
                >
                  Branch *
                </label>
                <input
                  type="text"
                  name="branch"
                  value={form.branch}
                  onChange={handleChange}
                  placeholder="e.g., Andheri West, Mumbai"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ "--tw-ring-color": "rgb(7,72,94)" }}
                />
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );

  // 🧱 List View
  const renderList = () => (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: "rgb(7,72,94)" }}
        >
          Supplier List
        </h1>

        <button
          onClick={() => setCurrentView("form")}
          className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all hover:shadow-lg"
          style={{
            backgroundColor: "rgb(7,72,94)",
            color: "white",
            border: "2px solid rgb(7,72,94)",
          }}
        >
          <User size={16} />
          Add Supplier
        </button>
      </div>

      {/* Supplier List Table */}
      <SupplierList />
    </div>
  );

  return currentView === "form" ? renderForm() : renderList();
};

export default SupplierForm;
