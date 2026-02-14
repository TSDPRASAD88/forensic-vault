const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getChain } = require("../controllers/blockchainController");

router.get("/", authMiddleware, getChain);

module.exports = router;
