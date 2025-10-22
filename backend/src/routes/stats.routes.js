const express = require("express");
const router = express.Router();
const statsController = require("../controllers/stats.controller");

router.get("/notes/all", statsController.allNotes);
router.get("/general", statsController.general);
router.get("/taxes", statsController.taxes);
router.get("/suppliers", statsController.suppliers);
router.get("/carriers", statsController.carriers);

module.exports = router;
