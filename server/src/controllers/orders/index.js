const express = require("express");
const router = express.Router();
const { addSalesOrder } = require("../../api/orders/add-order");
const { getAllSalesOrders } = require("../../api/orders/getsales-order");
const { generateInvoicePDF } = require("../../api/orders/invoice-pdf");

// Sales Order routes
router.post("/add", addSalesOrder); // Add new sales order
router.get("/list", getAllSalesOrders); // Get all sales orders
router.get("/:id/invoice-pdf", generateInvoicePDF); // Generate invoice PDF for an order

module.exports = router;