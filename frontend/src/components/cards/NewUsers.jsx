
import { useState } from "react";
import FollowBtn from "./FollowBtn";
import UserSearch from "./UserSearch";
import "./Cards.css";

function NewUsers({
    users,
    isfollowing,
    setIsfollowing,
    refreshFollowRequests,
    setNewUsers,
    setFollowingUsers,
    children
}) {
    const [search, setSearch] = useState("");

    const filteredUsers = users.filter((user) => {
        const searchValue = search.toLowerCase();

        return (
            user.name?.toLowerCase().includes(searchValue) ||
            user.username?.toLowerCase().includes(searchValue)
        );
    });

    return (
        <div className="new-users-page">
            <div className="users-banner new-users-banner">
                <div className="new-users-banner-content">
                    <span className="new-users-tag">
                        <i className="bi bi-stars"></i>
                        Developer Community
                    </span>

                    <h1>
                        Discover <span>New Developers!</span>
                    </h1>

                    <h2>Connect. Follow. Grow.</h2>

                    <p>
                        Meet talented developers, explore their GitHub profiles
                        and build meaningful connections.
                    </p>

                    <div className="new-users-banner-bottom">
                        <div className="new-users-total">
                            <i className="bi bi-people-fill"></i>
                            <div>
                                <strong>{users.length}</strong>
                                <span>Developers Available</span>
                            </div>
                        </div>

                        <div className="new-users-discover-label">
                            <i className="bi bi-compass"></i>
                            Discover Developers
                        </div>
                    </div>
                </div>

                <div className="new-users-banner-icon">
                    <i className="bi bi-globe2"></i>
                    <i className="bi bi-code-slash"></i>
                    <i className="bi bi-people-fill"></i>
                </div>
            </div>

            {users.length > 0 && (
                <UserSearch
                    value={search}
                    onChange={setSearch}
                    placeholder="Search new developers..."
                />
            )}

            {filteredUsers.length > 0 ? (
                <div className="new-users-grid">
                    {filteredUsers.map((user) => (
                        <div
                            className="new-user-card-horizontal"
                            key={user._id}
                        >
                            <div className="new-user-image">
                                <img
                                    src={user.avatar}
                                    alt={user.username}
                                    onClick={() =>
                                        window.open(user.profileUrl, "_blank")
                                    }
                                />
                            </div>

                            <div className="new-user-content">
                                <div className="new-user-details">
                                    <h4>{user.name}</h4>

                                    <a
                                        href={user.profileUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        @{user.username}
                                    </a>
                                </div>

                                <p className="new-user-bio">
                                    {user.bio ||
                                        "Developer and GitHub community member."}
                                </p>

                                <div className="new-user-footer">
                                    <span>
                                        <i className="bi bi-code-slash"></i>
                                        Developer
                                    </span>

                                    <FollowBtn
                                        isfollowing={isfollowing}
                                        user={user}
                                        setIsfollowing={setIsfollowing}
                                        refreshFollowRequests={refreshFollowRequests}
                                        setNewUsers={setNewUsers}
                                        setFollowingUsers={setFollowingUsers}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : users.length > 0 ? (
                <div className="notFoundPage">
                    <i className="bi bi-search" style={{ fontSize: "35px", color: "#66bce8" }}></i>
                    <h2>No Developers Found</h2>
                    <p>Try searching with another name or username.</p>
                </div>
            ) : (
                children
            )}
        </div>
    );
}

export default NewUsers;
