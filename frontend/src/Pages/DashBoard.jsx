import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../socket.js";
import DashBoardNavbar from "../components/dashboard/DashBoardNavbar.jsx";
import Sidebar from "../components/sidebar/Sidebar.jsx";
import Cards from "../components/cards/Cards.jsx";
import Messages from "./Messages.jsx";
import Overview from "../components/overview/Overview.jsx";
import "./DashBoard.css";
import SocketManager from "../components/SocketManager.jsx";
function DashBoard() {
    const [user, setUser] = useState(null);
    const [activeList, setActiveList] = useState("overview");
    const [isFollowRequest, setIsFollowRequest] = useState([]);
    const [newUserNotification, setNewUserNotification] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unreadConversations, setUnreadConversations] = useState(new Set());
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/users/me`,
                    { withCredentials: true }
                );
                setUser(response.data.user);
            } catch (err) {
                console.log(err.response?.data || err.message);
            }
        };

        fetchUser();
    }, []);
    useEffect(() => {
    if (!user?._id) return;

    const fetchUnreadConversations = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/messages/conversations`,
                { withCredentials: true }
            );

            const unreadIds =
                response.data.unreadConversationIds || [];

            setUnreadConversations(new Set(
                unreadIds.map(id => String(id))
            ));

        } catch (error) {
            console.error(
                "FETCH UNREAD MESSAGES ERROR:",
                error.response?.data || error.message
            );
        }
    };

    fetchUnreadConversations();
}, [user?._id]);
    useEffect(() => {
    const handleNewMessage = ({ message }) => {
        if (!message) return;

        const receiverId =
            typeof message.receiver === "object"
                ? message.receiver?._id
                : message.receiver;

        const senderId =
            typeof message.sender === "object"
                ? message.sender?._id
                : message.sender;

        if (String(receiverId) !== String(user?._id)) return;

        if (String(selectedUser?._id) === String(senderId)) return;

        setUnreadConversations((prev) => {
            const updated = new Set(prev);
            updated.add(String(senderId));
            return updated;
        });
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
        socket.off("newMessage", handleNewMessage);
    };
    }, [user?._id, selectedUser?._id]);
    const handleSelectConversation = (user) => {
    setSelectedUser(user);
    setUnreadConversations((prev) => {
        const updated = new Set(prev);
        updated.delete(String(user._id));
        return updated;
    });
    };
    const handleCloseConversation = () => {
    setSelectedUser(null);
    };

    if (!user) {
        return <div className="dashboard-topbar-loading">Loading...</div>;
    }

    return (
        <div className="dashboard-layout">
        <SocketManager />
            <Sidebar
                activeList={activeList}
                setActiveList={setActiveList}
                isFollowRequest={isFollowRequest}
                newUserNotification={newUserNotification}
                unreadMessages={unreadConversations.size}
            />

            <main className="dashboard-main">
                <DashBoardNavbar user={user} />

                <section className="dashboard-content">
                {activeList === "overview" && <Overview user={user} />}

                <div style={{ display: activeList === "overview" || activeList === "messages" ? "none" : "block" }}>
                    <Cards
                        activeList={activeList}
                        isFollowRequest={isFollowRequest}
                        setIsFollowRequest={setIsFollowRequest}
                        setNewUserNotification={setNewUserNotification}
                    />
                </div>

                {activeList === "messages" && (
                    <Messages
                        selectedUser={selectedUser}
                        onSelectConversation={handleSelectConversation}
                        onCloseConversation={handleCloseConversation}
                    />
                )}
            </section>
            </main>
        </div>
    );
}

export default DashBoard;