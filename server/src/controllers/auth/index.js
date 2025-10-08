const express = require("express");
const router = express.Router();

const login = require("../../api/auth/login");
const register = require("../../api/auth/register");
const {deleteUser } = require("../../api/auth/delete-User");
const { addUser } = require("../../api/auth/add-new-user");
const { getUsers } = require("../../api/auth/getUsers");
const { updateUser } = require("../../api/auth/update-users");  
const authMiddleware = require("../../middleware/auth");


router.get("/authcheck",authMiddleware); // protected route")
// Public routes
router.post("/register", register);
router.post("/login", login);


// ✅ CRUD routes
router.post("/users/add", addUser);    // Add new user
router.get("/users", getUsers);        // Show all users
router.put("/users/:id", updateUser);  // Edit user
router.delete("/users/:id", deleteUser); // Delete user

module.exports = router;
