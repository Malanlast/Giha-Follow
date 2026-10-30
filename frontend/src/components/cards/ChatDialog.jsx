import { socket } from "../../socket.js";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "./ChatDialog.css";

const API = "http://localhost:5000";

function getId(value) {
    return value?._id?.toString() ?? value?.toString();
}

function ChatDialog({ user, onClose }) {
    const [messages, setMessages] = useState([]);
    const [currUser, setCurrUser] = useState(null);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [presenceLoaded, setPresenceLoaded] = useState(false);

    const messagesEndRef = useRef(null);

    // Load logged-in user
    useEffect(() => {
        const loadCurrentUser = async () => {
            try {
                const response = await axios.get(
                    `${API}/api/users/me`,
                    { withCredentials: true }
                );

                setCurrUser(response.data.user);
            } catch (error) {
                console.error(
                    error.response?.data || error.message
                );
            }
        };

        loadCurrentUser();
    }, []);

    // Load conversation and listen to shared Socket.IO connection
    useEffect(() => {
        if (!currUser?._id || !user?._id) return;

        const currentUserId = getId(currUser._id);
        const otherUserId = getId(user._id);

        const loadMessages = async () => {
            try {
                const response = await axios.get(
                    `${API}/api/messages/${otherUserId}`,
                    { withCredentials: true }
                );

                setMessages(response.data.messages || []);
            } catch (error) {
                console.error(
                    error.response?.data || error.message
                );
            }
        };

        const handleConnect = () => {
            socket.emit("openConversation", otherUserId);
            socket.emit("getOnlineUsers");
        };

        const handleNewMessage = ({ message: newMessage }) => {
            if (!newMessage) return;

            const senderId = getId(newMessage.sender);
            const receiverId = getId(newMessage.receiver);

            const belongsToConversation =
                (senderId === currentUserId &&
                    receiverId === otherUserId) ||
                (senderId === otherUserId &&
                    receiverId === currentUserId);

            if (!belongsToConversation) return;

            setMessages((previous) => {
                const alreadyExists = previous.some(
                    (item) =>
                        getId(item._id) === getId(newMessage._id)
                );

                if (alreadyExists) return previous;

                return [...previous, newMessage];
            });
        };

        const handleMessagesSeen = ({ readerId, messageIds }) => {
            if (getId(readerId) !== otherUserId) return;

            const seenIds = new Set(
                (messageIds || []).map((id) => getId(id))
            );

            setMessages((previous) =>
                previous.map((item) =>
                    seenIds.has(getId(item._id))
                        ? { ...item, isSeen: true }
                        : item
                )
            );
        };

        const handleOnlineUsers = (userIds) => {
            const isUserOnline = userIds.some(
                (id) => getId(id) === otherUserId
            );

            setIsOnline(isUserOnline);
            setPresenceLoaded(true);
        };

        const handleUserOnline = ({ userId }) => {
            if (getId(userId) === otherUserId) {
                setIsOnline(true);
                setPresenceLoaded(true);
            }
        };

        const handleUserOffline = ({ userId }) => {
            if (getId(userId) === otherUserId) {
                setIsOnline(false);
                setPresenceLoaded(true);
            }
        };

        socket.on("connect", handleConnect);
        socket.on("newMessage", handleNewMessage);
        socket.on("messagesSeen", handleMessagesSeen);
        socket.on("onlineUsers", handleOnlineUsers);
        socket.on("userOnline", handleUserOnline);
        socket.on("userOffline", handleUserOffline);

        // Handle already-connected shared socket
        if (socket.connected) {
            handleConnect();
        }

        loadMessages();

        return () => {
            socket.off("connect", handleConnect);
            socket.off("newMessage", handleNewMessage);
            socket.off("messagesSeen", handleMessagesSeen);
            socket.off("onlineUsers", handleOnlineUsers);
            socket.off("userOnline", handleUserOnline);
            socket.off("userOffline", handleUserOffline);

            socket.emit("closeConversation");
        };
    }, [currUser?._id, user?._id]);

    // Scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    // Send message
    const sendMessage = async () => {
        const trimmedMessage = message.trim();

        if (!trimmedMessage || sending || !user?._id) return;

        try {
            setSending(true);

            await axios.post(
                `${API}/api/messages`,
                {
                    receiverId: user._id,
                    message: trimmedMessage,
                },
                { withCredentials: true }
            );

            setMessage("");
        } catch (error) {
            console.error(
                error.response?.data || error.message
            );
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="chat-overlay">
            <div className="chat-window">

                {/* Header */}
                <header className="chat-header">
                    <button
                        className="chat-back"
                        onClick={onClose}
                        aria-label="Close chat"
                        type="button"
                    >
                        <i className="bi bi-arrow-left"></i>
                    </button>

                    <button
                        className="chat-profile"
                        type="button"
                        onClick={() =>
                            user.profileUrl &&
                            window.open(
                                user.profileUrl,
                                "_blank",
                                "noopener,noreferrer"
                            )
                        }
                    >
                        <span className="chat-avatar-wrap">
                            <img
                                className="chat-avatar"
                                src={user.avatar}
                                alt={user.username}
                            />

                            <span
                                className={`chat-online-dot ${
                                    presenceLoaded
                                        ? isOnline
                                            ? "online"
                                            : "offline"
                                        : "unknown"
                                }`}
                                title={
                                    !presenceLoaded
                                        ? "Checking status..."
                                        : isOnline
                                            ? "Online"
                                            : "Offline"
                                }
                            />
                        </span>

                        <span className="chat-user-info">
                            <strong>{user.name}</strong>
                            <span>@{user.username}</span>
                        </span>
                    </button>

                    <button
                        className="chat-menu"
                        type="button"
                        aria-label="More options"
                        title="More options"
                    >
                        <i className="bi bi-three-dots-vertical"></i>
                    </button>
                </header>

                {/* Messages */}
                <main className="chat-messages">
                    <div className="chat-date-divider">
                        <span>Messages</span>
                    </div>

                    {messages.length === 0 ? (
                        <div className="chat-empty">
                            <img
                                src={user.avatar}
                                alt={user.username}
                            />
                            <strong>{user.name}</strong>
                            <span>@{user.username}</span>
                            <p>Start a conversation 👋</p>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMyMessage =
                                getId(msg.sender) ===
                                getId(currUser?._id);

                            return (
                                <div
                                    key={msg._id}
                                    className={`chat-message-row ${
                                        isMyMessage
                                            ? "sent"
                                            : "received"
                                    }`}
                                >
                                    {!isMyMessage && (
                                        <img
                                            className="chat-message-avatar"
                                            src={user.avatar}
                                            alt={user.username}
                                        />
                                    )}

                                    <div
                                        className={`chat-bubble ${
                                            isMyMessage
                                                ? "sent-bubble"
                                                : "received-bubble"
                                        }`}
                                    >
                                        <div className="chat-message-text">
                                            {msg.message}
                                        </div>

                                        <div className="chat-message-meta">
                                            {msg.createdAt &&
                                                new Date(
                                                    msg.createdAt
                                                ).toLocaleTimeString(
                                                    [],
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    }
                                                )}

                                            {isMyMessage && (
                                                <span
                                                    className={`chat-ticks ${
                                                        msg.isSeen
                                                            ? "seen"
                                                            : ""
                                                    }`}
                                                    title={
                                                        msg.isSeen
                                                            ? "Seen"
                                                            : "Sent"
                                                    }
                                                >
                                                    {msg.isSeen
                                                        ? "✓✓"
                                                        : "✓"}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}

                    {messages.some(
                        (msg) =>
                            getId(msg.sender) ===
                                getId(currUser?._id) &&
                            msg.isSeen
                    ) && (
                        <div className="chat-seen-label">
                            <i className="bi bi-check2-all"></i>
                            Seen
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </main>

                {/* Message input */}
                <form
                    className="chat-composer"
                    onSubmit={(event) => {
                        event.preventDefault();
                        sendMessage();
                    }}
                >
                    <button
                        type="button"
                        className="chat-emoji"
                        aria-label="Insert emoji"
                        onClick={() =>
                            setMessage((prev) => prev + "🙂")
                        }
                    >
                        <i className="bi bi-emoji-smile"></i>
                    </button>

                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(event) =>
                            setMessage(event.target.value)
                        }
                        aria-label="Message"
                    />

                    <button
                        type="submit"
                        className="chat-send"
                        disabled={sending || !message.trim()}
                        aria-label="Send message"
                    >
                        <i className="bi bi-send-fill"></i>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatDialog;