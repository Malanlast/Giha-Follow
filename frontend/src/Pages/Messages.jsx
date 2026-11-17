import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../socket.js";
import ChatDialog from "../components/chat/ChatDialog.jsx";
// import ChatMenu from "../components/chat/ChatMenu.jsx";
import "./Messages.css";
const API = import.meta.env.VITE_API_URL;
function Messages({ selectedUser, onSelectConversation,
    onCloseConversation, unreadConversations, currentUserId}) {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    // Fetch all conversations
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await axios.get(
                    `${API}/api/messages/conversations`,
                    { withCredentials: true }
                );

                setConversations(response.data.conversations || []);
            } catch (error) {
                console.error(
                    "FETCH CONVERSATIONS ERROR:",
                    error.response?.data || error.message
                );
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, []);
    useEffect(() => {
    const handleNewMessage = async ({ message }) => {
        if (!message) return;
        try {
            const response = await axios.get(
                `${API}/api/messages/conversations`,
                { withCredentials: true }
            );
            const latestConversations =
            response.data.conversations || [];
            setConversations(latestConversations);
        } catch (error) {
            console.error(
                "UPDATE CONVERSATIONS ERROR:",
                error.response?.data || error.message
            );
        }
    };
    socket.on("newMessage", handleNewMessage);
    return () => {
        socket.off("newMessage", handleNewMessage);
    };
    }, [currentUserId]);
    return (
        <div
            className={`messages-page ${
                selectedUser ? "chat-selected" : ""
            }`}
        >
            {/* Top Banner */}
            <div className="messages-banner">
                <div className="messages-banner-content">
                    <h3>Messages</h3>
                    <p>Stay connected with your community</p>
                </div>

                <i className="bi bi-chat-dots"></i>
            </div>
            {/* Main Content */}
            <div className="messages-content">
                {/* Left: Conversation List */}
                <div className="messages-sidebar">
                    <h3>Conversations</h3>
                    <div className="conversation-list">
                        {loading ? (
                            <p className="no-conversations">
                                Loading conversations...
                            </p>
                        ) : conversations.length === 0 ? (
                            <p className="no-conversations">
                                No conversations yet.
                            </p>
                        ) : (
                            conversations.map((user) => (
                                <div
                                    className={`conversation-item ${
                                        selectedUser?._id === user._id
                                            ? "active"
                                            : ""
                                    }`}
                                    key={user._id}
                                    onClick={() => onSelectConversation(user)}
                                >
                                    <img
                                        src={user.avatar}
                                        alt={user.username}
                                        className="conversation-avatar"
                                    />
                                    <div className="conversation-info">
                                    <div className="conversation-name-row">
                                        <strong>{user.name}</strong>
                                        {unreadConversations?.has(String(user._id)) && (
                                            <i
                                                className="bi bi-chat-dots-fill unread-message-icon"
                                                title="Unread message"
                                            ></i>
                                        )}
                                    </div>
                                    <span>@{user.username}</span>
                                        <p>
                                            {user.lastMessage?.isDeleted
                                                ? "This message was deleted"
                                                : user.lastMessage?.message}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                {/* Right: Chat Area */}
                <div className="messages-chat">
                    {selectedUser ? (
                        <ChatDialog
                            user={selectedUser}
                            onClose={onCloseConversation}
                            inline
                            onConversationDeleted={(userId) => {
                                setConversations((previous) =>
                                    previous.filter(
                                        (item) =>
                                            item._id.toString() !== userId
                                    )
                                );
                            }}
                        />
                    ) : (
                        <div className="messages-placeholder">
                            <i className="bi bi-chat-dots"></i>

                            <h4>Select a conversation</h4>

                            <p>
                                Choose someone from your conversations
                                to start chatting.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
export default Messages;