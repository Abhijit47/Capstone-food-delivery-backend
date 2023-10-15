const mongoose = require('mongoose');
const { Schema } = mongoose;

const querySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  }

}, { versionKey: false, timestamps: true });

const Query = mongoose.model('Query', querySchema);
module.exports = Query;