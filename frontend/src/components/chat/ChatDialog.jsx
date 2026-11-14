import React from "react";
import { socket } from "../../socket.js";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "./ChatDialog.css";
import ChatMenu from "./ChatMenu";
const API = import.meta.env.VITE_API_URL;
function getId(value) {
    return value?._id?.toString() ?? value?.toString();
}
function canDeleteForEveryone(createdAt) {
    const age = Date.now() - new Date(createdAt).getTime();
    return age >= 0 && age <= 15 * 60 * 1000;
}
function ChatDialog({ user, onClose, inline = false,  onConversationDeleted }) {
    const [messages, setMessages] = useState([]);
    const [currUser, setCurrUser] = useState(null);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [presenceLoaded, setPresenceLoaded] = useState(false);
    const [activeMessageMenu, setActiveMessageMenu] = useState(null);

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

        const handleMessageDeleted = ({ message: updatedMessage }) => {
            if (!updatedMessage) return;

            setMessages((previous) =>
                previous.map((item) =>
                    getId(item._id) === getId(updatedMessage._id)
                        ? updatedMessage
                        : item
                )
            );
        };

        socket.on("messageDeleted", handleMessageDeleted);
        socket.on("connect", handleConnect);
        socket.on("newMessage", handleNewMessage);
        socket.on("messagesSeen", handleMessagesSeen);
        socket.on("onlineUsers", handleOnlineUsers);
        socket.on("userOnline", handleUserOnline);
        socket.on("userOffline", handleUserOffline);

        // Handle an already-connected shared socket
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
            socket.off("messageDeleted", handleMessageDeleted);
            socket.emit("closeConversation");
        };
    }, [currUser?._id, user?._id]);

    // Scroll to latest message
    const previousMessageCount = useRef(0);

    useEffect(() => {
        if (messages.length > previousMessageCount.current) {
            messagesEndRef.current?.scrollIntoView({
                behavior: "smooth",
            });
        }

        previousMessageCount.current = messages.length;
    }, [messages]);

    // Close message menu when clicking outside
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                !event.target.closest(
                    ".message-options, .message-menu-button"
                )
            ) {
                setActiveMessageMenu(null);
            }
        };

        document.addEventListener("click", handleOutsideClick);

        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);

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

    // Delete message only for the current user
    const deleteMessageForMe = async (messageId) => {
        try {
            await axios.delete(
                `${API}/api/messages/single/${messageId}`,
                { withCredentials: true }
            );

            setMessages((previousMessages) =>
                previousMessages.filter(
                    (msg) => getId(msg._id) !== getId(messageId)
                )
            );

            setActiveMessageMenu(null);
        } catch (error) {
            console.error("DELETE MESSAGE ERROR:", error);
            alert(
                error.response?.data?.message ||
                "Failed to delete message"
            );
        }
    };
  const deleteConversation = async () => {
    const otherUserId = getId(user._id);

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this conversation?"
    );

    if (!confirmDelete) return;

    try {
        await axios.delete(
            `${API}/api/messages/${otherUserId}`,
            { withCredentials: true }
        );

        setMessages([]);
        onConversationDeleted?.(otherUserId);
        onClose();

    } catch (error) {
        console.error("DELETE CONVERSATION ERROR:", error);

        alert(
            error.response?.data?.message ||
            "Failed to delete conversation"
        );
    }
    };

    // Delete message for everyone (sender only, within 15 minutes)
    const deleteMessageForEveryone = async (messageId) => {
        try {
            const response = await axios.delete(
                `${API}/api/messages/single/${messageId}/everyone`,
                { withCredentials: true }
            );

            const updatedMessage =
                response.data.updatedMessage;

            if (updatedMessage) {
                setMessages((previous) =>
                    previous.map((msg) =>
                        getId(msg._id) === getId(messageId)
                            ? updatedMessage
                            : msg
                    )
                );
            }

            setActiveMessageMenu(null);
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to delete message for everyone"
            );
        }
    };
    const formatMessageDate = (date) => {
    const messageDate = new Date(date);
    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const isSameDay = (date1, date2) =>
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear();

    if (isSameDay(messageDate, today)) return "Today";
    if (isSameDay(messageDate, yesterday)) return "Yesterday";

    return messageDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    };

    return (
        <div className={`chat-overlay container-fluid ${inline ? "chat-inline" : ""}`}>
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

                   <ChatMenu
                        githubUsername={user.username}
                        onDeleteConversation={deleteConversation}
                    />
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
                        messages.map((msg, index) => {
                        const isMyMessage =
                            getId(msg.sender) === getId(currUser?._id);

                        const currentDate = new Date(msg.createdAt).toDateString();

                        const previousDate =
                            index > 0
                                ? new Date(messages[index - 1].createdAt).toDateString()
                                : null;

                        const showDateSeparator = currentDate !== previousDate;

                        return (
                            <React.Fragment key={msg._id}>
                                {showDateSeparator && (
                                    <div className="chat-date-separator">
                                        <span>{formatMessageDate(msg.createdAt)}</span>
                                    </div>
                                )}

                                <div
                                    className={`chat-message-row ${
                                        isMyMessage ? "sent" : "received"
                                    } ${
                                        activeMessageMenu === msg._id ? "selected" : ""
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
                                            isMyMessage ? "sent-bubble" : "received-bubble"
                                        }`}
                                    >
                                        {!msg.isDeleted && (
                                            <button
                                                type="button"
                                                className="message-menu-button"
                                                onClick={(event) =>{
                                                    event.stopPropagation();
                                                    setActiveMessageMenu(
                                                        activeMessageMenu === msg._id
                                                            ? null
                                                            : msg._id
                                                    )
                                                }}
                                                aria-label="Message options"
                                            >
                                                <i className="bi bi-three-dots"></i>
                                            </button>
                                        )}

                                        {activeMessageMenu === msg._id &&
                                            !msg.isDeleted && (
                                                <div className="message-options"
                                                onClick={(event)=>event.stopPropagation()}>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            deleteMessageForMe(msg._id)
                                                        }
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                        Delete for me
                                                    </button>

                                                    {isMyMessage &&
                                                        canDeleteForEveryone(msg.createdAt) && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (
                                                                        window.confirm(
                                                                            "Delete this message for everyone?"
                                                                        )
                                                                    ) {
                                                                        deleteMessageForEveryone(
                                                                            msg._id
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                                Delete for everyone
                                                            </button>
                                                        )}
                                                </div>
                                            )}

                                        <div
                                            className={`chat-message-text ${
                                                msg.isDeleted ? "deleted-message" : ""
                                            }`}
                                        >
                                            {msg.isDeleted ? (
                                                <em>This message was deleted</em>
                                            ) : (
                                                msg.message
                                            )}
                                        </div>

                                        <div className="chat-message-meta">
                                            <span className="chat-time">
                                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>

                                            {isMyMessage && !msg.isDeleted && (
                                                <span
                                                    className={`chat-ticks ${
                                                        msg.isSeen ? "seen" : ""
                                                    }`}
                                                    title={msg.isSeen ? "Seen" : "Sent"}
                                                >
                                                    ✓✓
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })
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
                            setMessage((previous) => previous + "🙂")
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
