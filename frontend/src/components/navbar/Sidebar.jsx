
import './Sidebar.css';

function Sidebar({
    activeList,
    setActiveList,
    newUserNotification = [],
    isFollowRequest = []
}) {
    const menuItems = [
        { id: "overview", label: "Overview", icon: "bi-grid" },
        { id: "new", label: "New Users", icon: "bi-people" },
        { id: "followers", label: "Followers", icon: "bi-person" },
        { id: "following", label: "Followings", icon: "bi-person-check" },
        { id: "messages", label: "Messages", icon: "bi-chat-dots" },
        { id: "follow-requests", label: "Requests", icon: "bi-person-plus" }
    ];

    return (
        <aside className="dashboard-sidebar">

            {/* Brand */}
            <div className="sidebar-brand">
                <img src="/GihaLogo.png" alt="GiHA Follow" />

                <div>
                    <h2>GiHA Follow</h2>
                    <span>Developer Community</span>
                </div>
            </div>

            <div className="sidebar-divider"></div>

            {/* Scrollable Navigation */}
            <nav className="sidebar-menu">
                {menuItems.map((item) => {

                    const count =
                        item.id === "new"
                            ? newUserNotification.length
                            : item.id === "follow-requests"
                            ? isFollowRequest.length
                            : 0;

                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveList(item.id)}
                            className={`sidebar-link ${
                                activeList === item.id ? "active" : ""
                            }`}
                        >
                            <i className={`bi ${item.icon}`}></i>

                            <span>{item.label}</span>

                            {count > 0 && (
                                <span className="sidebar-count">
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Bottom GitHub Cat Artwork */}
            <div className="sidebar-art">
                <div className="sidebar-art-glow"></div>
            </div>

            {/* Bottom Gradient Overlay */}
            <div className="sidebar-bottom-overlay"></div>

        </aside>
    );
}

export default Sidebar;
