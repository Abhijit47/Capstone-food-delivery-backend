const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer', // Reference to the Customer model for the customer who placed the order.
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant', // Reference to the Restaurant model for the restaurant where the order was placed.
    required: true,
  },
  items: [{
    foodItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodItem', // Reference to the FoodItem model for the items in the order.
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now, // You can set a default order date to the current date and time.
  },
}, { versionKey: false, timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
