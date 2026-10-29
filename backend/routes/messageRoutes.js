const express = require("express");
const {
    sendMessage,
    getMessages,
    deleteConversation,
} = require("../controllers/messageController.js");

const isAuthenticated = require("../middleware/authMiddleware.js");
const router = express.Router();

router.post("/", isAuthenticated, sendMessage);
router.get("/:userId", isAuthenticated, getMessages);
router.delete("/:userId", isAuthenticated, deleteConversation);

module.exports = router;