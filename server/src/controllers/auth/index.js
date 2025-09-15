const express = require("express");
const router = express.Router();

const login = require("../../api/auth/login");
const register = require("../../api/auth/register");
const { addUser, getUsers, updateUser, deleteUser } = require("../../api/auth/users");

router.post("/register", register);
router.post("/login", login);

// ✅ CRUD routes
router.post("/users/add", addUser);    // Add new user
router.get("/users", getUsers);        // Show all users
router.put("/users/:id", updateUser);  // Edit user
router.delete("/users/:id", deleteUser); // Delete user

module.exports = router;
