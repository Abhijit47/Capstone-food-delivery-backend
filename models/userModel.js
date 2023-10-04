const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Schema } = mongoose;

// define a user schema
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "name field shouldn't be blank! required"],
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "email field shouldn't be blank! required"],
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, "phone field shouldn't be blank! required"],
  },
  role: {
    type: String,
    enum: ["admin", "moderator", "user"],
    default: "user"
  },
  password: {
    type: String,
    required: [true, "password field shouldn't be blank! required"],
    min: 6,
    max: 1024,
  },
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order', // Reference to the Order model for customer's orders.
  }],
  passwordResetAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
}, { versionKey: false, timestamps: true });

// encrypt the password before saving the document
userSchema.pre("save", async function (next) {
  const user = this;
  // check if the password field is modified or not
  if (!user.isModified('password')) {
    next();
  }
  // create a salt for password
  const salt = await bcrypt.genSalt(12);

  // create hashed password
  user.password = await bcrypt.hash(user.password, salt);

  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordResetAt = Date.now() - 1000;
  next();
});

// compare password
userSchema.methods.compare = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// create token
userSchema.methods.createToken = async function (payload) {
  return jwt.sign(
    payload,
    process.env.ACCESS_TOKEN,
    { expiresIn: process.env.EXPIRES_IN }
  );
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// compile a model
const User = mongoose.model("User", userSchema);
module.exports = User;