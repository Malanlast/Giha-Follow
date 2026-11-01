const express = require("express");
const {
    sendMessage,
    getMessages,getConversations,
    deleteConversation,
    deleteMessageForMe,
    deleteMessageForEveryone ,
} = require("../controllers/messageController.js");

const isAuthenticated = require("../middleware/authMiddleware.js");
const router = express.Router();

router.post("/", isAuthenticated, sendMessage);
router.delete("/single/:messageId", isAuthenticated, deleteMessageForMe);
router.delete("/single/:messageId/everyone",isAuthenticated,deleteMessageForEveryone);
router.get("/conversations", isAuthenticated, getConversations);
router.get("/:userId", isAuthenticated, getMessages);
router.delete("/:userId", isAuthenticated, deleteConversation);

module.exports = router;