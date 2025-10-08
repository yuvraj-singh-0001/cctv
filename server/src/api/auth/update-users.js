const bcrypt = require("bcryptjs");
const User = require("../../models/User");

// 📌 Update user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const update = { name, email: email?.toLowerCase().trim() };
    if (password) {
      update.password = await bcrypt.hash(password, 10);
    }

    const result = await User.findByIdAndUpdate(id, update, { new: true });
    if (!result) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "✅ User updated successfully" });
  } catch (err) {
    console.error("❌ Update user error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
module.exports = { updateUser };