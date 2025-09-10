const pool = require("../../api/config/db");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO register (name, email, password) VALUES (?, ?, ?)", [
      name,
      email,
      hashedPassword,
    ]);

    res.json({ success: true, message: "✅ Registration successful!" });
  } catch (err) {
    console.error("❌ Register error:", err.message);

    // ✅ Agar duplicate entry hai (email already exist)
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ success: false, message: "❌ This email is already registered!" });
    }

    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = register;
