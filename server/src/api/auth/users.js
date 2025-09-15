const pool = require("../../api/config/db");
const bcrypt = require("bcryptjs");

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
    // Check if user already exists
    const [existingUser] = await pool.promise().query(
      "SELECT id FROM users WHERE email = ?", 
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: "User with this email already exists" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await pool.promise().query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ 
      success: true, 
      message: "✅ User added successfully",
      userId: result.insertId
    });
  } catch (err) {
    console.error("❌ Add user error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

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

module.exports = { addUser, getUsers, updateUser, deleteUser };
