const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    supplierId: { type: String, required: true, unique: true }, // UUID from frontend
    name: { type: String, required: true },
    contactPerson: { type: String },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    gstNumber: { type: String },
    panNumber: { type: String },
    bankDetails: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true } // auto createdAt, updatedAt
);

module.exports = mongoose.model("Supplier", supplierSchema);
