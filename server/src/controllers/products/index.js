const express = require("express");
const router = express.Router();

const { addProduct, getProducts, getTodayProducts } = require("../../api/products/products");

// Product routes
router.post("/add", addProduct);           // Add new product
router.get("/", getProducts);              // Get all products
router.get("/today", getTodayProducts);    // Get today's products

module.exports = router;
