import React, { useState } from "react";

const SupplierForm = () => {
  const [form, setForm] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    gstNumber: "",
    panNumber: "",
    bankDetails: "",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [message, setMessage] = useState("");

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
    setMessage("");
    const supplierData = { ...form };

    try {
      const res = await fetch("http://localhost:5000/api/master/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(supplierData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Supplier added successfully!");
        setForm({
          name: "",
          contactPerson: "",
          phone: "",
          email: "",
          address: "",
          gstNumber: "",
          panNumber: "",
          bankDetails: "",
          status: "active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } else {
        setMessage(data.message || "Failed to add supplier.");
      }
    } catch (err) {
      setMessage("Server error. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-2xl">
      <h2 className="text-2xl font-bold mb-6">Add Supplier</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Supplier Name */}
        <div>
          <label className="block font-medium">Supplier / Company Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        {/* Contact Person */}
        <div>
          <label className="block font-medium">Contact Person</label>
          <input
            type="text"
            name="contactPerson"
            value={form.contactPerson}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block font-medium">Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          ></textarea>
        </div>

        {/* GST Number */}
        <div>
          <label className="block font-medium">GST Number</label>
          <input
            type="text"
            name="gstNumber"
            value={form.gstNumber}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* PAN Number */}
        <div>
          <label className="block font-medium">PAN Number</label>
          <input
            type="text"
            name="panNumber"
            value={form.panNumber}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Bank Details */}
        <div>
          <label className="block font-medium">Bank Details</label>
          <textarea
            name="bankDetails"
            value={form.bankDetails}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          ></textarea>
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Save Supplier
        </button>
        {message && (
          <div className="mt-2 text-center text-blue-700 font-semibold">
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default SupplierForm;
