const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

// Create order schema
const orderSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: 'User', // Reference to the Customer/user model for the customer who placed the order.
    required: true,
  },
  restaurant: {
    type: ObjectId,
    ref: 'Restaurant', // Reference to the Restaurant model for the restaurant where the order was placed.
    required: true,
  },
  items: [{
    foodItem: {
      type: ObjectId,
      ref: 'FoodItem', // Reference to the FoodItem model for the items in the order.
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  }],
  price: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now, // You can set a default order date to the current date and time.
  },
  paid: {
    type: Boolean,
    default: true
  }
}, { versionKey: false });

orderSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "restaurant",
    select: "name"
  });
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
