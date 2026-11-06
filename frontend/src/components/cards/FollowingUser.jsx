import FollowBtn from "./FollowBtn";
import ChatDialog from "../chat/ChatDialog.jsx";
import { useState } from "react";
import "./Cards.css";

function FollowingUser({
    users,
    isfollowing,
    setIsfollowing,
    refreshFollowRequests,
    setNewUsers,
    setFollowingUsers,
    children
}) {
    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <div className="following-users-page">

            {/* Top Banner */}
            <div className="following-users-banner">
                <div className="following-users-banner-content">

                    <span className="following-users-tag">
                        <i className="bi bi-stars"></i>
                        Developer Community
                    </span>

                    <h1>
                        Your <span>Connections!</span>
                    </h1>

                    <h2>Connect. Follow. Grow.</h2>

                    <p>
                        Stay connected with developers, explore their
                        GitHub profiles and build meaningful connections.
                    </p>

                    <div className="following-users-banner-bottom">

                        <div className="following-users-total">
                            <i className="bi bi-people-fill"></i>

                            <div>
                                <strong>{users.length}</strong>
                                <span>Developers</span>
                            </div>
                        </div>

                        <div className="following-users-label">
                            <i className="bi bi-person-check-fill"></i>
                            Your Connections
                        </div>

                    </div>
                </div>

                <div className="following-users-banner-icon">
                    <i className="bi bi-globe2"></i>
                    <i className="bi bi-code-slash"></i>
                    <i className="bi bi-people-fill"></i>
                </div>
            </div>

            {/* Users Data / Empty State */}
            {users.length > 0 ? (
                <div className="following-users-grid">

                    {users.map((user) => (
                        <div
                            className="following-user-card"
                            key={user._id}
                        >
                            <div className="following-user-image">
                                <img
                                    src={user.avatar}
                                    alt={user.username}
                                    onClick={() =>
                                        window.open(user.profileUrl, "_blank")
                                    }
                                />
                            </div>

                            <div className="following-user-content">

                                <div className="following-user-details">
                                    <h4>{user.name}</h4>

                                    <a
                                        href={user.profileUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        @{user.username}
                                    </a>
                                </div>

                                <p className="following-user-bio">
                                    {user.bio ||
                                        "Developer and GitHub community member."}
                                </p>

                                <div className="following-user-footer">

                                    <span>
                                        <i className="bi bi-code-slash"></i>
                                        Developer
                                    </span>

                                    <div className="following-user-actions">

                                        <FollowBtn
                                            isfollowing={isfollowing}
                                            user={user}
                                            setIsfollowing={setIsfollowing}
                                            refreshFollowRequests={refreshFollowRequests}
                                            setNewUsers={setNewUsers}
                                            setFollowingUsers={setFollowingUsers}
                                        />

                                        <button
                                            className="btn chatBtn"
                                            onClick={() => setSelectedUser(user)}
                                            title="Chat"
                                        >
                                            <i className="bi bi-chat-dots-fill"></i>
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            ) : (
                children
            )}

            {/* Chat Dialog */}
            {selectedUser && (
                <ChatDialog
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}

        </div>
    );
}

export default FollowingUser;