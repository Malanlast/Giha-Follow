import "./RecentActivity.css";

const activities = [
    {
        id: 1,
        type: "push",
        title: "Pushed 3 commits",
        description: "Updated authentication and dashboard features.",
        repo: "Giha-Follow",
        time: "2 hours ago",
        icon: "bi-git"
    },
    {
        id: 2,
        type: "create",
        title: "Created a repository",
        description: "Started a new full-stack project.",
        repo: "React-Project",
        time: "Yesterday",
        icon: "bi-folder-plus"
    },
    {
        id: 3,
        type: "pull",
        title: "Opened a pull request",
        description: "Added a new feature to the project.",
        repo: "MediaCherry",
        time: "2 days ago",
        icon: "bi-git"
    },
    {
        id: 4,
        type: "issue",
        title: "Opened an issue",
        description: "Reported a bug for further improvements.",
        repo: "Giha-Follow",
        time: "3 days ago",
        icon: "bi-exclamation-circle"
    }
];

function RecentActivity() {
    return (
        <section className="recent-activity-section">
            <div className="recent-activity-header">
                <div>
                    <h2>Recent Activity</h2>
                    <p>Your latest GitHub activities</p>
                </div>
                <span className="activity-label">
                    <i className="bi bi-activity"></i>
                    Recent Updates
                </span>
            </div>

            <div className="activity-timeline">
                {activities.map((activity) => (
                    <div className="activity-item" key={activity.id}>
                        <div className={`activity-icon ${activity.type}`}>
                            <i className={`bi ${activity.icon}`}></i>
                        </div>

                        <div className="activity-details">
                            <div className="activity-title-row">
                                <h3>{activity.title}</h3>
                                <span>{activity.time}</span>
                            </div>

                            <p>{activity.description}</p>

                            <span className="activity-repo">
                                <i className="bi bi-github"></i>
                                {activity.repo}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default RecentActivity;