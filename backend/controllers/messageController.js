
const { getIO } = require("../socket.js");
const Message = require("../models/message.js");
const User = require("../models/User.js");

// Send message
const sendMessage = async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        const senderId = req.session.userId;

        if (!receiverId || typeof message !== "string" || !message.trim()) {
            return res.status(400).json({
                message: "Receiver and message are required",
            });
        }

        if (senderId.toString() === receiverId.toString()) {
            return res.status(400).json({
                message: "Cannot message yourself",
            });
        }

        const [sender, receiver] = await Promise.all([
            User.findById(senderId),
            User.findById(receiverId),
        ]);

        if (!sender || !receiver) {
            return res.status(404).json({ message: "User not found" });
        }
        let newMessage = await Message.create({
            sender: senderId,
            receiver: receiverId,
            message: message.trim(),
        });
        const io = getIO();
        // Check whether the recipient currently has this conversation open.
        const receiverSockets = await io
            .in(receiverId.toString())
            .fetchSockets();
        const recipientIsReading = receiverSockets.some(
            (socket) =>
                socket.data.activeChatUserId === senderId.toString()
        );
        if (recipientIsReading) {
            newMessage = await Message.findByIdAndUpdate(
                newMessage._id,
                { $set: { isSeen: true } },
                { new: true }
            );
            // Immediately notify the sender that this message was seen.
            io.to(senderId.toString()).emit("messagesSeen", {
                readerId: receiverId.toString(),
                messageIds: [newMessage._id.toString()],
            });
        }
        // Send only to the authenticated participants' rooms.
        io.to(senderId.toString()).emit("newMessage", {
            message: newMessage,
        });
        io.to(receiverId.toString()).emit("newMessage", {
            message: newMessage,
        });
        return res.status(201).json({ message: newMessage });
        } catch (error) {
        console.error("SEND MESSAGE ERROR:", error);
        return res.status(500).json({
            message: "Failed to send message",
        });
    }
};
// Get messages and mark received messages as seen
const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.session.userId;
        if (currentUserId.toString() === userId) {
            return res.status(400).json({
                message: "Cannot open a conversation with yourself",
            });
        }
        const receiverExists = await User.exists({ _id: userId });
        if (!receiverExists) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        // Mark only incoming, visible, unread messages as seen.
        const updatedMessages = await Message.find({
            sender: userId,
            receiver: currentUserId,
            isSeen: false,
            hiddenFor: { $ne: currentUserId },
        }).select("_id");
        if (updatedMessages.length > 0) {
            const messageIds = updatedMessages.map((msg) => msg._id);
            await Message.updateMany(
                { _id: { $in: messageIds }, isSeen: false },
                { $set: { isSeen: true } }
            );
            // Notify the original sender that their messages were seen.
            const io = getIO();
            io.to(userId.toString()).emit("messagesSeen", {
                readerId: currentUserId.toString(),
                messageIds: messageIds.map((id) => id.toString()),
            });
        }
        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: userId },
                { sender: userId, receiver: currentUserId },
            ],
            hiddenFor: { $ne: currentUserId },
        }).sort({ createdAt: 1 });
        return res.status(200).json({
            count: messages.length,
            messages,
        });
    } catch (error) {
        console.error("GET MESSAGE ERROR:", error);

        return res.status(500).json({
            message: "Failed to fetch messages",
        });
    }
}; 
// Get all users with whom the current user has conversations
const getConversations = async (req, res) => {
    try {
        const currentUserId = req.session.userId;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId },
                { receiver: currentUserId }
            ],
            hiddenFor: { $ne: currentUserId }
        }).sort({ createdAt: -1 });

        const conversationMap = new Map();

        for (const msg of messages) {
            const otherUserId =
                msg.sender.toString() === currentUserId.toString()
                    ? msg.receiver.toString()
                    : msg.sender.toString();

            // First message is the latest because of descending sort
            if (!conversationMap.has(otherUserId)) {
                conversationMap.set(otherUserId, msg);
            }
        }

        const userIds = [...conversationMap.keys()];

        const users = await User.find({
            _id: { $in: userIds }
        }).select("name username avatar profileUrl");

        const conversations = users.map(user => ({
            ...user.toObject(),
            lastMessage: conversationMap.get(user._id.toString())
        }));

        conversations.sort(
            (a, b) =>
                new Date(b.lastMessage.createdAt) -
                new Date(a.lastMessage.createdAt)
        );

        return res.status(200).json({ conversations });

    } catch (error) {
        console.error("GET CONVERSATIONS ERROR:", error);

        return res.status(500).json({
            message: "Failed to fetch conversations"
        });
    }
};
// Delete a single message only for the current user
const deleteMessageForMe = async (req, res) => {
    try {
        const { messageId } = req.params;
        const currentUserId = req.session.userId;
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({
                message: "Message not found",
            });
        }
        // Only sender or receiver can hide this message
        const isParticipant =
            message.sender.toString() === currentUserId.toString() ||
            message.receiver.toString() === currentUserId.toString();
        if (!isParticipant) {
            return res.status(403).json({
                message: "Not authorized to delete this message",
            });
        }
        await Message.findByIdAndUpdate(messageId, {
            $addToSet: { hiddenFor: currentUserId },
        });
        return res.status(200).json({
            message: "Message deleted successfully",
            messageId,
        });
    } catch (error) {
        console.error("DELETE MESSAGE ERROR:", error);

        return res.status(500).json({
            message: "Failed to delete message",
        });
    }
};
// Delete a single message for everyone
const deleteMessageForEveryone = async (req, res) => {
    try {
        const { messageId } = req.params;
        const currentUserId = req.session.userId;

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({
                message: "Message not found",
            });
        }

        // Only the original sender can delete for everyone
        if (message.sender.toString() !== currentUserId.toString()) {
            return res.status(403).json({
                message: "Only the sender can delete this message for everyone",
            });
        }

        // Check 15-minute time limit
        const fifteenMinutes = 15 * 60 * 1000;
        const messageAge =
            Date.now() - new Date(message.createdAt).getTime();

        if (messageAge > fifteenMinutes) {
            return res.status(400).json({
                message: "You can delete this message only within 15 minutes",
            });
        }

        if (message.isDeleted) {
            return res.status(400).json({
                message: "Message is already deleted",
            });
        }

        // Replace original message with deletion notice
        const updatedMessage = await Message.findByIdAndUpdate(
            messageId,
            {
                $set: {
                    isDeleted: true,
                    message: "This message was deleted",
                },
            },
            { new: true }
        );

        // Notify both participants through Socket.IO
        const io = getIO();

        io.to(message.sender.toString()).emit("messageDeleted", {
            message: updatedMessage,
        });

        io.to(message.receiver.toString()).emit("messageDeleted", {
            message: updatedMessage,
        });

        return res.status(200).json({
            message: "Message deleted for everyone",
            updatedMessage,
        });
    } catch (error) {
        console.error("DELETE MESSAGE FOR EVERYONE ERROR:", error);

        return res.status(500).json({
            message: "Failed to delete message for everyone",
        });
    }
};
// Delete conversation only for the current user
const deleteConversation = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.session.userId;

        if (currentUserId.toString() === userId) {
            return res.status(400).json({
                message: "Cannot delete a conversation with yourself",
            });
        }

        const userExists = await User.exists({ _id: userId });

        if (!userExists) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        await Message.updateMany(
            {
                $or: [
                    { sender: currentUserId, receiver: userId },
                    { sender: userId, receiver: currentUserId },
                ],
                hiddenFor: { $ne: currentUserId },
            },
            { $addToSet: { hiddenFor: currentUserId } }
        );

        return res.status(200).json({
            message: "Conversation deleted successfully",
        });
    } catch (error) {
        console.error("DELETE CONVERSATION ERROR:", error);

        return res.status(500).json({
            message: "Failed to delete conversation",
        });
    }
};
module.exports = {
    sendMessage,
    getMessages,
    getConversations,
    deleteConversation,
    deleteMessageForMe,
    deleteMessageForEveryone 
};
