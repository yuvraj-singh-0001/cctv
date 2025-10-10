const { v4: uuidv4 } = require("uuid");
const mongoose = require('mongoose');
const SalesOrder = require("../../models/SalesOrder");
const Product = require("../../models/Product");

// Add new Sales Order
const addSalesOrder = async (req, res) => {
  try {
    
    const { 
      customer_name, 
      customer_phone, 
      customer_email, 
      customer_address, 
      items, 
      tax = 0, 
      discount = 0, 
      payment_status = 'Pending', 
      order_status = 'Processing' 
    } = req.body;

    // ✅ Validate required fields
    if (!customer_name || !customer_phone || !customer_address) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: customer_name, customer_phone, customer_address are required."
      });
    }

    // ✅ Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product item is required."
      });
    }

    // ✅ Validate each item and check product existence
    const validatedItems = [];
    
    for (const item of items) {
      // Check if product ID is a valid MongoDB ObjectId
      if (!item.product || !mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({
          success: false,
          message: `Invalid product ID: ${item.product}. Please select a valid product.`
        });
      }

      // Check if product exists in database
      const productExists = await Product.findById(item.product);
      if (!productExists) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${item.product} not found.`
        });
      }

      // Check if sufficient stock is available
      if (productExists.quantity < (item.quantity || 0)) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${productExists.productName}. Available: ${productExists.quantity}, Requested: ${item.quantity}`
        });
      }

      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Each item must have a valid quantity greater than 0."
        });
      }

      // Ensure price and quantity are numbers
      const price = parseFloat(item.price) || productExists.price; // Use product price if not provided
      const quantity = parseInt(item.quantity) || 0;
      const total = price * quantity;
      
      validatedItems.push({
        product: item.product, // This should now be a valid ObjectId
        quantity: quantity,
        price: price,
        total: total
      });
    }

    // ✅ Calculate subtotal & totals
    const subtotal = validatedItems.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = parseFloat(tax) || 0;
    const discountAmount = parseFloat(discount) || 0;
    const grand_total = Math.max(0, subtotal + taxAmount - discountAmount);

    // ✅ Generate unique order number
    const order_number = "SO-" + uuidv4().split("-")[0].toUpperCase();

    // ✅ Create and save order
    const salesOrder = new SalesOrder({
      order_number,
      customer_name,
      customer_phone,
      customer_email,
      customer_address,
      items: validatedItems,
      subtotal,
      tax: taxAmount,
      discount: discountAmount,
      grand_total,
      payment_status,
      order_status
    });

    await salesOrder.save();
   

    // ✅ Decrease product quantity from stock
    for (const item of validatedItems) {
      try {
        const updatedProduct = await Product.findByIdAndUpdate(
          item.product, 
          { $inc: { quantity: -item.quantity } },
          { new: true }
        );
       
      } catch (productError) {
        console.error(`❌ Error updating stock for product ${item.product}:`, productError);
        // Continue with other products even if one fails
      }
    }

    res.status(201).json({
      success: true,
      message: "Sales order created successfully!",
      orderId: salesOrder._id,
      order: salesOrder
    });

  } catch (err) {
    console.error("❌ Error creating sales order:", err);
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Order number already exists. Please try again.",
        error: err.message
      });
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(e => e.message).join(', ');
      return res.status(400).json({
        success: false,
        message: "Validation error: " + validationErrors,
        error: err.message
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create sales order.",
      error: err.message
    });
  }
};

module.exports = { addSalesOrder };