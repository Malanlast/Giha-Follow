
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

        socket.join(userId);

        // Track all active connections for this user
        let userSockets = onlineUsers.get(userId);

        if (!userSockets) {
            userSockets = new Set();
            onlineUsers.set(userId, userSockets);
        }

        const wasOffline = userSockets.size === 0;
        userSockets.add(socket.id);

        // Send current online users to this client
        socket.emit("onlineUsers", [...onlineUsers.keys()]);

        // Notify others only when the user comes online
        if (wasOffline) {
            socket.broadcast.emit("userOnline", { userId });
        }

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

        socket.on("disconnect", () => {
            socket.data.activeChatUserId = null;

            const sockets = onlineUsers.get(userId);

            if (!sockets) return;

            sockets.delete(socket.id);

            // Mark offline only when all connections are gone
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
