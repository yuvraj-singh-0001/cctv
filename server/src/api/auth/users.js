const pool = require("../../api/config/db");
const bcrypt = require("bcryptjs");

// 📌 Get all users
const getUsers = async (req, res) => {
  try {
    const [rows] = await pool.promise().query(
      "SELECT id, name, email, created_at FROM users"
    );
    res.json({ success: true, users: rows });
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
    let query = "UPDATE users SET name = ?, email = ? WHERE id = ?";
    let values = [name, email, id];

    // If password is provided, hash it and update as well
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";
      values = [name, email, hashedPassword, id];
    }

    const [result] = await pool.promise().query(query, values);

    if (result.affectedRows === 0) {
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
    const [result] = await pool.promise().query("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "🗑️ User deleted successfully" });
  } catch (err) {
    console.error("❌ Delete user error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getUsers, updateUser, deleteUser };
