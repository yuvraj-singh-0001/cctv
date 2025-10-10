const mongoose = require('mongoose');

const SalesOrderSchema = new mongoose.Schema(
  {
    order_number: { 
      type: String, 
      required: true, 
      unique: true 
    },
    customer_name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    customer_phone: { 
      type: String, 
      required: true,
      trim: true 
    },
    customer_email: { 
      type: String, 
      trim: true 
    },
    customer_address: { 
      type: String, 
      required: true,
      trim: true 
    },

    items: [
      {
        product: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Product', 
          required: true 
        },
        quantity: { 
          type: Number, 
          required: true,
          min: 1
        },
        price: { 
          type: Number, 
          required: true 
        },
        total: { 
          type: Number, 
          required: true 
        }
      }
    ],

    subtotal: { 
      type: Number, 
      required: true 
    },
    tax: { 
      type: Number, 
      default: 0 
    },
    discount: { 
      type: Number, 
      default: 0 
    },
    grand_total: { 
      type: Number, 
      required: true 
    },

    payment_status: {
      type: String,
      enum: ['Pending', 'Paid', 'Cancelled'],
      default: 'Pending'
    },
    order_status: {
      type: String,
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing'
    }
  },
  { 
    timestamps: true 
  }
);

// Add index for better performance
// SalesOrderSchema.index({ order_number: 1 }); // REMOVE THIS LINE - duplicate index
SalesOrderSchema.index({ customer_email: 1 });
SalesOrderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('SalesOrder', SalesOrderSchema);