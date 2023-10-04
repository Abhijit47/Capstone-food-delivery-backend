const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  picture: {
    type: String, // You can store the URL of the picture or the image file name.
    required: true,
  },
}, { versionKey: false, timestamps: true });

const FoodItem = mongoose.model('FoodItem', foodItemSchema);

module.exports = FoodItem;
