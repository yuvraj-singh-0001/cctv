const Supplier = require("../../../models/supplier");

const editSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Supplier.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Supplier not found" });
    res.json({ message: "Supplier updated!", supplier: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update supplier.", error: err.message });
  }
};

module.exports = { editSupplier };