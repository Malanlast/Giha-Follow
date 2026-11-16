
let io;

const onlineUsers = new Map();

const setIO = (socketIO) => {
    io = socketIO;

    io.use((socket, next) => {
        const session = socket.request.session;

        if (!session?.userId) {
            return next(new Error("Unauthorized"));
        }

        socket.data.userId = session.userId.toString();
        next();
    });

    io.on("connection", (socket) => {
        const userId = socket.data.userId;

        // Join authenticated user's private room
        socket.join(userId);

        // Track multiple connections for the same user
        let userSockets = onlineUsers.get(userId);

        if (!userSockets) {
            userSockets = new Set();
            onlineUsers.set(userId, userSockets);
        }

        const wasOffline = userSockets.size === 0;
        userSockets.add(socket.id);

        // Send the current online users to the newly connected client
        socket.emit("onlineUsers", [...onlineUsers.keys()]);
        socket.on("getOnlineUsers", () => {
            socket.emit("onlineUsers", [...onlineUsers.keys()]);
        });

        // Notify other clients when this user becomes online
        if (wasOffline) {
            socket.broadcast.emit("userOnline", { userId });
        }

        // Existing conversation tracking
        socket.on("openConversation", (otherUserId) => {
            if (
                typeof otherUserId !== "string" ||
                otherUserId === userId
            ) {
                return;
            }

            socket.data.activeChatUserId = otherUserId;
        });

        socket.on("closeConversation", () => {
            socket.data.activeChatUserId = null;
        });
        // Handle typing indicator
        socket.on("typing", () => {
            const receiverId = socket.data.activeChatUserId;

            if (!receiverId) return;

            io.to(receiverId).emit("userTyping", {
                userId
            });
        });

        // Handle stop typing
        socket.on("stopTyping", () => {
            const receiverId = socket.data.activeChatUserId;

            if (!receiverId) return;

            io.to(receiverId).emit("userStopTyping", {
                userId
            });
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            socket.data.activeChatUserId = null;

            const sockets = onlineUsers.get(userId);

            if (!sockets) return;

            sockets.delete(socket.id);

            // User becomes offline only after all connections close
            if (sockets.size === 0) {
                onlineUsers.delete(userId);

                io.emit("userOffline", { userId });
            }
        });
    });
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO is not initialized");
    }

    return io;
};

module.exports = { setIO, getIO };
