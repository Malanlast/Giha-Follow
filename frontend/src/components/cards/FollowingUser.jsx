import { useState } from "react";
import FollowBtn from "./FollowBtn";
import UserSearch from "./UserSearch";
import ChatDialog from "../chat/ChatDialog.jsx";
import "./Cards.css";

function FollowingUser({
    bannerType = "following",
    users,
    isfollowing,
    setIsfollowing,
    refreshFollowRequests,
    setNewUsers,
    setFollowingUsers,
    children
}) {
    const [selectedUser, setSelectedUser] = useState(null);
    const [search, setSearch] = useState("");

    const bannerContent = {
        following: {
            tag: "Your Network",
            title: "Your",
            highlight: "Connections!",
            subtitle: "Connect. Follow. Grow.",
            description:
                "Stay connected with developers you follow and explore their GitHub profiles.",
            label: "Your Connections",
            icon: "bi-person-check-fill"
        },

        followers: {
            tag: "Developer Community",
            title: "People",
            highlight: "Following You!",
            subtitle: "Connect. Share. Grow.",
            description:
                "Discover developers who follow you and build meaningful connections.",
            label: "Your Followers",
            icon: "bi-person-fill"
        }
    };

    const banner = bannerContent[bannerType] || bannerContent.following;

    const filteredUsers = users.filter((user) => {
        const searchValue = search.toLowerCase();

        return (
            user.name?.toLowerCase().includes(searchValue) ||
            user.username?.toLowerCase().includes(searchValue)
        );
    });

    return (
        <div className="following-users-page">

            {/* Banner */}
            <div className={`users-banner ${bannerType}-users-banner`}>
                <div className="following-users-banner-content">

                    <span className="following-users-tag">
                        <i className="bi bi-stars"></i>
                        {banner.tag}
                    </span>

                    <h1>
                        {banner.title} <span>{banner.highlight}</span>
                    </h1>

                    <h2>{banner.subtitle}</h2>

                    <p>{banner.description}</p>

                    <div className="following-users-banner-bottom">

                        <div className="following-users-total">
                            <i className="bi bi-people-fill"></i>

                            <div>
                                <strong>{users.length}</strong>
                                <span>Developers</span>
                            </div>
                        </div>

                        <div className="following-users-label">
                            <i className={`bi ${banner.icon}`}></i>
                            {banner.label}
                        </div>

                    </div>
                </div>

                <div className="following-users-banner-icon">
                    <i className="bi bi-globe2"></i>
                    <i className="bi bi-code-slash"></i>
                    <i className="bi bi-people-fill"></i>
                </div>
            </div>

            {/* Search */}
            {users.length > 0 && (
                <UserSearch
                    value={search}
                    onChange={setSearch}
                    placeholder={
                        bannerType === "followers"
                            ? "Search followers..."
                            : "Search following..."
                    }
                />
            )}

            {/* Users Data / Empty State */}
            {filteredUsers.length > 0 ? (
                <div className="following-users-grid">

                    {filteredUsers.map((user) => (
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
            ) : users.length > 0 ? (
                <div className="notFoundPage">
                    <i
                        className="bi bi-search"
                        style={{ fontSize: "35px", color: "#66bce8" }}
                    ></i>
                    <h2>No Developers Found</h2>
                    <p>Try searching with another name or username.</p>
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
