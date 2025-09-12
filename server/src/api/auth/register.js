const pool = require("../../api/config/db");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Use promise version of pool.query
    const [result] = await pool
      .promise()
      .query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
      );

    res.json({ success: true, message: "✅ Registration successful!" });
  } catch (err) {
    console.error("❌ Register error:", err.message);

    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ success: false, message: "❌ This email is already registered!" });
    }

    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = register;
