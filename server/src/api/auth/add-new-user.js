const bcrypt = require("bcryptjs");
const User = require("../../models/User");


// 📌 Add new user
const addUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "Name, email, and password are required" 
    });
  }

  try {
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: "User with this email already exists" 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: email.toLowerCase().trim(), password: hashedPassword });

    res.status(201).json({ 
      success: true, 
      message: "✅ User added successfully",
      userId: user._id
    });
  } catch (err) {
    console.error("❌ Add user error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
module.exports = {addUser};