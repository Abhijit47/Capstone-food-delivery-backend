const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = require("mongoose");

const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  cuisine: {
    type: [String], // Indian, Italian, American
    required: true,
  },
  rating: {
    type: Number,
    default: 0, // You can set a default rating value if needed.
  },
  openingTime: {
    type: String, // You can store the opening time as a string, e.g., "08:00 AM"
    required: true,
  },
  closingTime: {
    type: String, // You can store the closing time as a string, e.g., "10:00 PM"
    required: true,
  },
  // Authentication fields
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["admin", "moderator"],
  },
  menu: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodItem', // Reference to the FoodItem model for the restaurant's menu.
  }],
}, { versionKey: false, timestamps: true });

// encrypt the password before saving the document
restaurantSchema.pre("save", async function (next) {
  const restaurentUser = this;
  // check if the password field is modified or not
  if (!restaurentUser.isModified('password')) {
    next();
  }
  // create a salt for password
  const salt = await bcrypt.genSalt(12);

  // create hashed password
  restaurentUser.password = await bcrypt.hash(restaurentUser.password, salt);

  next();
});

// compare password
restaurantSchema.methods.compare = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
