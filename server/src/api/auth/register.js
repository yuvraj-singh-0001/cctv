const bcrypt = require("bcryptjs");
const User = require("../../models/User");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "❌ This email is already registered!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email: email.toLowerCase().trim(), password: hashedPassword });

    res.json({ success: true, message: "✅ Registration successful!" });
  } catch (err) {
    console.error("❌ Register error:", err.message);
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "❌ This email is already registered!" });
    }

    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = register;
