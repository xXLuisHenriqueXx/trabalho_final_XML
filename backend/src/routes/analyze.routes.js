const express = require("express");
const router = express.Router();
const { uploadAndAnalyze } = require("../controllers/analyze.controller");

router.post("/", uploadAndAnalyze);

module.exports = router;
