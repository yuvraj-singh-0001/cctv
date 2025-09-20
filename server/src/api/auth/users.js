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

module.exports = { addUser, getUsers, updateUser, deleteUser };
