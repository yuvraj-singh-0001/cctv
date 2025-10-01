const Supplier = require("../../../models/supplier");

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Supplier.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Supplier not found" });
    res.json({ message: "Supplier deleted!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete supplier.", error: err.message });
  }
};

module.exports = { deleteSupplier };