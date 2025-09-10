const express = require("express");
const router = express.Router();

const login = require("../../api/auth/login");
const register = require("../../api/auth/register");

router.post("/register", register);
router.post("/login", login);

module.exports = router;
