const bcrypt = require("bcryptjs");
const User = require("../../models/User");


// 📌 Delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "🗑️ User deleted successfully" });
  } catch (err) {
    console.error("❌ Delete user error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { deleteUser };
