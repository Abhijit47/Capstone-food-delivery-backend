const mongoose = require("mongoose");

const MONGO_URI = process.env.DATABASE_URI;
const MONGO_PASSWORD = process.env.DATABASE_PASSWORD;

const DB = MONGO_URI.replace("<password>", MONGO_PASSWORD);

// set strict query for filters
mongoose.set('strictQuery', true);
mongoose.set("strictPopulate", false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB);
    console.log(`MongoDB Connection Established: ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;