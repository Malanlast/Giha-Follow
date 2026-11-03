import "./Repositories.css";

const repositories = [
    {
        id: 1,
        name: "Giha-Follow",
        description: "A developer community platform with GitHub OAuth, follow system and real-time features.",
        language: "JavaScript",
        stars: 24,
        forks: 8,
        updated: "2 days ago",
        icon: "bi-people"
    },
    {
        id: 2,
        name: "MediaCherry",
        description: "A full-stack platform with authentication, subscriptions and AI-powered features.",
        language: "JavaScript",
        stars: 18,
        forks: 5,
        updated: "5 days ago",
        icon: "bi-code-slash"
    },
    {
        id: 3,
        name: "Kite-Clone",
        description: "A trading dashboard interface inspired by modern stock market platforms.",
        language: "JavaScript",
        stars: 12,
        forks: 3,
        updated: "1 week ago",
        icon: "bi-graph-up"
    }
];

function Repositories() {
    return (
        <section className="repositories-section">

            <div className="repositories-header">
                <div>
                    <h2>Your Repositories</h2>
                    <p>Explore your latest GitHub projects</p>
                </div>

                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="view-all-repos"
                >
                    View All
                    <i className="bi bi-arrow-up-right"></i>
                </a>
            </div>

            <div className="repositories-grid">
                {repositories.map((repo) => (
                    <article className="repository-card" key={repo.id}>

                        <div className="repository-card-top">
                            <div className="repository-icon">
                                <i className={`bi ${repo.icon}`}></i>
                            </div>

                            <span className="repository-public">
                                <i className="bi bi-globe2"></i>
                                Public
                            </span>
                        </div>

                        <h3>{repo.name}</h3>

                        <p className="repository-description">
                            {repo.description}
                        </p>

                        <div className="repository-language">
                            <span className="language-dot"></span>
                            {repo.language}
                        </div>

                        <div className="repository-footer">
                            <div className="repository-stats">
                                <span>
                                    <i className="bi bi-star"></i>
                                    {repo.stars}
                                </span>

                                <span>
                                    <i className="bi bi-diagram-2"></i>
                                    {repo.forks}
                                </span>
                            </div>

                            <span className="repository-updated">
                                {repo.updated}
                            </span>
                        </div>

                        <div className="repository-card-action">
                            <a
                                href={`https://github.com/Malanlast/${repo.name}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                View Repository
                                <i className="bi bi-arrow-right"></i>
                            </a>
                        </div>

                    </article>
                ))}
            </div>

        </section>
    );
}

export default Repositories;