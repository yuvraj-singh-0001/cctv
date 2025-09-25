const express = require("express");
const router = express.Router();

const { getSuppliers } = require("../../api/master/get-supplier");
const{addSupplier}=require("../../api/master/post-supplier");

// Product routes
router.post("/add", addSupplier);           // Add new supplier
router.get("/", getSuppliers);              // Get all suppliers  

module.exports = router;
