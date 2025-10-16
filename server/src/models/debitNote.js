// models/DebitNote.js
const mongoose = require("mongoose");

const DebitNoteSchema = new mongoose.Schema(
  {
    debit_note_number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    related_order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalesOrder",
      required: true,
    },
    customer_name: {
      type: String,
      required: true,
      trim: true,
    },
    customer_phone: {
      type: String,
      trim: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        total: {
          type: Number,
          required: true,
        },
      },
    ],
    total_amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

DebitNoteSchema.index({ createdAt: -1 });

module.exports = mongoose.model("DebitNote", DebitNoteSchema);
