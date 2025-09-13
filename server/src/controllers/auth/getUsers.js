const pool = require("../../api/config/db");

const getUsers = async (req, res) => {
  try {
    // Fetch all users (you can limit fields like exclude password)
    const [rows] = await pool.promise().query(
      "SELECT id, name, email, created_at FROM users"
    );

    res.json({
      success: true,
      users: rows,
    });
  } catch (err) {
    console.error("❌ Fetch users error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = getUsers;
