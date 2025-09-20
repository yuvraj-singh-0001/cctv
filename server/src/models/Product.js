const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true, trim: true },
    model_number: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 0 },
    resolution: { type: String },
    lens_specification: { type: String },
    poe_support: { type: Boolean, default: false },
    night_vision: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('Product', ProductSchema);
