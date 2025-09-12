const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config(); // <-- load environment variables here

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cctv_db",
});

// Test connection when file loads
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
  } else {
    console.log(`✅ MySQL connected to database: ${process.env.DB_NAME}`);
    connection.release();
  }
});

module.exports = pool;
