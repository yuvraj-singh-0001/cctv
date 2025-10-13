const express = require("express");
const router = express.Router();
const { addSalesOrder } = require("../../api/orders/add-order");
const { getAllSalesOrders } = require("../../api/orders/getsales-order");

// Sales Order routes
router.post("/add", addSalesOrder); // Add new sales order
router.get("/list", getAllSalesOrders); // Get all sales orders

module.exports = router;