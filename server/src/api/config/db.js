const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // <-- load environment variables here

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/cctv_db";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      // options can be added if needed
    });
    console.log("✅ MongoDB connected:", MONGO_URI);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
