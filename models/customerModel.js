const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures that each customer has a unique email.
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order', // Reference to the Order model for customer's orders.
  }],
}, { versionKey: false, timestamps: true });

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
