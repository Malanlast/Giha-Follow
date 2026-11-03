import { useState } from "react";
import DashBoardNavbar from "../components/dashboard/DashBoardNavbar.jsx";
import Sidebar from "../components/navbar/Sidebar.jsx";
import Cards from "../components/cards/Cards.jsx";
import Messages from "./Messages.jsx";
import Overview from "../components/overview/Overview.jsx";
import "./DashBoard.css";

function DashBoard() {
    const [activeList, setActiveList] = useState("overview");
    const [isFollowRequest, setIsFollowRequest] = useState([]);
    const [newUserNotification, setNewUserNotification] = useState([]);

    return (
        <div className="dashboard-layout">
            <Sidebar
                activeList={activeList}
                setActiveList={setActiveList}
                isFollowRequest={isFollowRequest}
                newUserNotification={newUserNotification}
            />

            <main className="dashboard-main">
                <DashBoardNavbar />

                <section className="dashboard-content">
                    {activeList === "overview" ? (
                        <Overview />
                    ) : activeList === "messages" ? (
                        <Messages />
                    ) : (
                        <Cards
                            activeList={activeList}
                            isFollowRequest={isFollowRequest}
                            setIsFollowRequest={setIsFollowRequest}
                            setNewUserNotification={setNewUserNotification}
                        />
                    )}
                </section>
            </main>
        </div>
    );
}

export default DashBoard;