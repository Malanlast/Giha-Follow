const express = require("express");
const {sendMessage,getMessages,} = require("../controllers/messageController.js");
const isAuthenticated = require("../middleware/authMiddleware.js");
const router = express.Router();
router.post("/", isAuthenticated, sendMessage);
router.get("/:userId", isAuthenticated, getMessages);
module.exports = router;