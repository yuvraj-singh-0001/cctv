// routes/debitNoteRoutes.js
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const DebitNote = require("../../models/debitNote");
const SalesOrder = require("../../models/SalesOrder");

// ✅ Create Debit Note
const createDebitNote = async (req, res) => {
  try {
    const { debit_note_number, related_order, reason, items, total_amount } = req.body;

    // fetch customer details from Sales Order
    const order = await SalesOrder.findById(related_order);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const newDebitNote = new DebitNote({
      debit_note_number,
      related_order,
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      reason,
      items,
      total_amount,
    });

    const savedNote = await newDebitNote.save();

    res.status(201).json({
      success: true,
      message: "Debit Note created successfully",
      note: savedNote,
    });
  } catch (error) {
    console.error("❌ Error creating debit note:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating debit note",
      error: error.message,
    });
  }
};

// ✅ Get All Debit Notes
const getAllDebitNotes = async (req, res) => {
  try {
    const debitNotes = await DebitNote.find()
      .populate("related_order", "order_number customer_name grand_total")
      .populate("items.product", "product_name price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: debitNotes.length,
      notes: debitNotes,
    });
  } catch (error) {
    console.error("❌ Error fetching debit notes:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching debit notes",
      error: error.message,
    });
  }
};

// ✅ Get Single Debit Note by ID
const getDebitNoteById = async (req, res) => {
  try {
    const note = await DebitNote.findById(req.params.id)
      .populate("related_order")
      .populate("items.product", "product_name price");

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Debit Note not found",
      });
    }

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    console.error("❌ Error fetching debit note:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching debit note",
      error: error.message,
    });
  }
};

// ✅ Update Debit Note Status
const updateDebitNoteStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedNote = await DebitNote.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        success: false,
        message: "Debit Note not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    console.error("❌ Error updating debit note status:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating debit note status",
      error: error.message,
    });
  }
};

module.exports = {
  createDebitNote,
  getAllDebitNotes,
  getDebitNoteById,
  updateDebitNoteStatus,
};