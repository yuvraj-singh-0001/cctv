const { v4: uuidv4 } = require("uuid");
const Supplier = require("../../models/supplier");

// Add new supplier
const addSupplier = async (req, res) => {
  try {
    const supplierData = {
      ...req.body,
      supplierId: uuidv4(), // yahan backend par generate ho raha hai
    };
    const supplier = new Supplier(supplierData);
    await supplier.save();
    res.status(201).json({ message: "Supplier added successfully!", supplier });
  } catch (err) {
    res.status(500).json({ message: "Failed to add supplier.", error: err.message });
  }
};

module.exports = { addSupplier };