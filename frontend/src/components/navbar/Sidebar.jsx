import './Sidebar.css';
import RepoDialogBox from "../repository/RepoDialogBox";
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
            <div className="sidebar-brand">
                <img src="/GihaLogo.png" alt="Giha Follow" />
                <div>
                    <h2>GiHA Follow</h2>
                    <span>Developer Community</span>
                </div>
            </div>

            <div className="sidebar-divider"></div>

            <p className="sidebar-heading">MAIN MENU</p>

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
                                <span className="sidebar-count">{count}</span>
                            )}
                        </button>
                    );
                })}
            </nav>

            <div className="sidebar-repository">
                <p className="sidebar-heading">REPOSITORIES</p>
                <RepoDialogBox />
            </div>
        </aside>
    );
}

export default Sidebar;