
import axios from "axios";
import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

const API = "http://localhost:5000";

function getId(value) {
    return value?._id?.toString() ?? value?.toString();
}

function ChatDialog({ user, onClose }) {
    const [messages, setMessages] = useState([]);
    const [currUser, setCurrUser] = useState(null);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);

    // Load current logged-in user
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

    // Connect socket and load conversation
    useEffect(() => {
        if (!currUser?._id || !user?._id) return;

        const currentUserId = getId(currUser._id);
        const otherUserId = getId(user._id);

        const socket = io(API, {
            withCredentials: true,
        });

        socketRef.current = socket;

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

        loadMessages();

        // Listen only to messages belonging to this conversation
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
                if (
                    previous.some(
                        (item) => getId(item._id) === getId(newMessage._id)
                    )
                ) {
                    return previous;
                }

                return [...previous, newMessage];
            });
        };

        // Update ticks when the recipient has seen messages
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
        socket.on("connect", () => {
            socket.emit("openConversation", otherUserId);
        });
        socket.on("newMessage", handleNewMessage);
        socket.on("messagesSeen", handleMessagesSeen);

        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.off("messagesSeen", handleMessagesSeen);
            socket.emit("closeConversation");
            socket.disconnect();
            socketRef.current = null;
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
        <div
            className="modal d-block container-fluid"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    {/* Header */}
                    <div className="modal-header">
                        <div className="d-flex align-items-center">
                            <img
                                src={user.avatar}
                                alt={user.username}
                                style={{
                                    width: "45px",
                                    height: "45px",
                                    borderRadius: "50%",
                                    marginRight: "10px",
                                }}
                            />

                            <div>
                                <h5 className="mb-0">{user.name}</h5>
                                <small className="text-body-secondary">
                                    @{user.username}
                                </small>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Close chat"
                        />
                    </div>

                    {/* Messages */}
                    <div
                        className="modal-body"
                        style={{
                            minHeight: "300px",
                            maxHeight: "400px",
                            overflowY: "auto",
                        }}
                    >
                        {messages.length === 0 ? (
                            <p className="text-center text-body-secondary">
                                No messages yet
                            </p>
                        ) : (
                            messages.map((msg) => {
                                const isMyMessage =
                                    getId(msg.sender) === getId(currUser?._id);

                                return (
                                    <div
                                        key={msg._id}
                                        className={`d-flex mb-2 ${
                                            isMyMessage
                                                ? "justify-content-end"
                                                : "justify-content-start"
                                        }`}
                                    >
                                        <div
                                            className={`px-3 py-2 rounded ${
                                                isMyMessage
                                                    ? "bg-primary text-white"
                                                    : "bg-light text-dark border"
                                            }`}
                                            style={{
                                                maxWidth: "75%",
                                                wordBreak: "break-word",
                                            }}
                                        >
                                            <div>{msg.message}</div>

                                            {isMyMessage && (
                                                <div
                                                    className="text-end small"
                                                    title={
                                                        msg.isSeen
                                                            ? "Seen"
                                                            : "Sent"
                                                    }
                                                    aria-label={
                                                        msg.isSeen
                                                            ? "Seen"
                                                            : "Sent"
                                                    }
                                                >
                                                    <span
                                                        style={{
                                                            color: msg.isSeen
                                                                ? "#63d9ff"
                                                                : "#d3d3d3",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        {msg.isSeen ? "✓✓" : "✓"}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}

                        <div ref={messagesEndRef} />

                        {/* Message input */}
                        <div className="d-flex gap-2 mt-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Type a message..."
                                value={message}
                                onChange={(event) =>
                                    setMessage(event.target.value)
                                }
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        sendMessage();
                                    }
                                }}
                            />

                            <button
                                className="btn btn-primary"
                                onClick={sendMessage}
                                disabled={sending || !message.trim()}
                            >
                                {sending ? "Sending..." : "Send"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatDialog;
