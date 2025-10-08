const User = require("../../models/User");

// 📌 Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, { name: 1, email: 1, created_at: 1 }).sort({ created_at: -1 });
    const formatted = users.map(u => ({ id: u._id, name: u.name, email: u.email, created_at: u.created_at }));
    res.json({ success: true, users: formatted });
  } catch (err) {
    console.error("❌ Fetch users error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
module.exports = {getUsers};