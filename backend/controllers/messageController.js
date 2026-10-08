const { getIO } = require("../socket.js");
const Message = require("../models/message.js");
const User = require("../models/User.js");

// Send message
const sendMessage = async (req, res) => {
    try {
        const { receiverId, message } = req.body;

        if (!receiverId || !message.trim()) {
            return res.status(400).json({
                message: "Receiver and message are required",
            });
        }

        const senderId = req.session.userId;

        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const newMessage = await Message.create({
            sender: senderId,
            receiver: receiverId,
            message: message.trim(),
        });
        const io = getIO();

        io.emit("newMessage", {
            message: newMessage,
        });

        return res.status(201).json({
            message: newMessage,
        });

    } catch (error) {
        console.log(error.message);

        return res.status(500).json({
            message: "Failed to send message",
        });
    }
};


// Get chat messages
const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.session.userId;

        const messages = await Message.find({
            $or: [
                {
                    sender: currentUserId,
                    receiver: userId,
                },
                {
                    sender: userId,
                    receiver: currentUserId,
                },
            ],
        }).sort({ createdAt: 1 });

        return res.status(200).json({
            count: messages.length,
            messages,
        });

    } catch (error) {
        console.log("GET MESSAGE ERROR:", error);

        return res.status(500).json({
            message: "Failed to fetch messages",
        });
    }
};


module.exports = {
    sendMessage,
    getMessages,
};