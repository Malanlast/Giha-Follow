import "./StatsBanner.css";

const stats = [
    {
        id: 1,
        label: "Followers",
        value: "1,250",
        icon: "bi-people",
        color: "followers"
    },
    {
        id: 2,
        label: "Following",
        value: "320",
        icon: "bi-person-check",
        color: "following"
    },
    {
        id: 3,
        label: "Total Stars",
        value: "486",
        icon: "bi-star",
        color: "stars"
    }
];

function StatsBanner() {
    return (
        <section className="stats-banner">
            {stats.map((stat) => (
                <div className="stats-card" key={stat.id}>
                    <div className={`stats-icon ${stat.color}`}>
                        <i className={`bi ${stat.icon}`}></i>
                    </div>

                    <div className="stats-info">
                        <h3>{stat.value}</h3>
                        <p>{stat.label}</p>
                    </div>
                </div>
            ))}
        </section>
    );
}

export default StatsBanner;