const express = require("express");
const router = express.Router();
const { addSalesOrder } = require("../../api/orders/add-order");
const { getAllSalesOrders } = require("../../api/orders/getsales-order");
const { generateInvoicePDF } = require("../../api/orders/invoice-pdf");
const { createDebitNote, getAllDebitNotes,updateDebitNoteStatus,getDebitNoteById } = require("../../api/orders/debitNote");


// Sales Order routes
router.get("/debit-notes", getAllDebitNotes); // Get all debit notes
router.post("/debit-notes", createDebitNote); // Create a new debit note
router.put("/debit-notes/:id/status", updateDebitNoteStatus); // Update debit note status
router.get("/debit-notes/:id",getDebitNoteById); // Get debit note by ID

router.post("/add", addSalesOrder); // Add new sales order
router.get("/list", getAllSalesOrders); // Get all sales orders
router.get("/:id/invoice-pdf", generateInvoicePDF); // Generate invoice PDF for an order

module.exports = router;