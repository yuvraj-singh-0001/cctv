const express = require("express");
const router = express.Router();
const { addSalesOrder } = require("../../api/orders/add-order");

// Sales Order routes
router.post("/add", addSalesOrder); // Add new sales order

module.exports = router;