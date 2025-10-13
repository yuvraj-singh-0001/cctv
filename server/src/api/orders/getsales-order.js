// Get All Sales Orders (with product details)
const SalesOrder = require("../../models/SalesOrder");

const getAllSalesOrders = async (req, res) => {
  try {
    // You can add filters or pagination later if needed
    const salesOrders = await SalesOrder.find()
      .populate("items.product", "productName price") // product name and price show karne ke liye
      .sort({ createdAt: -1 }); // latest orders first
 

    res.status(200).json({
      success: true,
      count: salesOrders.length,
      orders: salesOrders
    });
  } catch (err) {
    console.error("❌ Error fetching sales orders:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sales orders.",
      error: err.message
    });
  }
};

module.exports = { getAllSalesOrders };
