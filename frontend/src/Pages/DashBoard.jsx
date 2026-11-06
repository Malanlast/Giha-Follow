import { useEffect, useState } from "react";
import axios from "axios";
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

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/users/me",
                    { withCredentials: true }
                );
                setUser(response.data.user);
            } catch (err) {
                console.log(err.response?.data || err.message);
            }
        };

        fetchUser();
    }, []);

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

                {activeList === "messages" && <Messages />}
            </section>
            </main>
        </div>
    );
}

export default DashBoard;