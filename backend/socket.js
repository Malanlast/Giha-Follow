let io;

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

        // Only the authenticated user's room
        socket.join(userId);

        socket.on("openConversation", (otherUserId) => {
            if (typeof otherUserId !== "string" || otherUserId === userId) {
                return;
            }

            // This records UI state only; it grants no room access.
            socket.data.activeChatUserId = otherUserId;
        });

        socket.on("closeConversation", () => {
            socket.data.activeChatUserId = null;
        });

        socket.on("disconnect", () => {
            socket.data.activeChatUserId = null;
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