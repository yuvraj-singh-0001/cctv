const express = require("express");
const router = express.Router();

const { addProduct} = require("../../api/products/add-products");
const{ getTodayProducts } = require("../../api/products/get-today-products");
const { getProducts } = require("../../api/products/get-all-products");

// Product routes
router.post("/add", addProduct);           // Add new product
router.get("/", getProducts);              // Get all products
router.get("/today", getTodayProducts);    // Get today's products

module.exports = router;
