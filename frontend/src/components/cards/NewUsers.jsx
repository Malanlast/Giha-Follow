import FollowBtn from "./FollowBtn";
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
    return (
        <div className="new-users-page">
            {/* Top Banner */}
            <div className="new-users-banner">
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

            {/* Users List */}
            {users.length > 0 ? (
                <div className="new-users-grid">
                    {users.map((user) => (
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
            ) : (
                children
            )}
        </div>
    );
}

export default NewUsers;