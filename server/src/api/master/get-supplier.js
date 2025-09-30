const Supplier = require("../../models/supplier");

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
     
    res.json({ suppliers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching suppliers", error: error.message });
  }
};

module.exports = { getSuppliers };
