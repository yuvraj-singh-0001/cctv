const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "❌ Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "❌ Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1d" } // token valid for 1 day
    );

    // Send token in HttpOnly cookie
    res
      .cookie("token", token, {
        httpOnly: true, // prevents JS from reading it
        secure: process.env.NODE_ENV === "production", // HTTPS only in prod
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .json({
        message: "✅ Login successful!",
        user: { id: user._id, name: user.name, email: user.email },
      });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = login;
