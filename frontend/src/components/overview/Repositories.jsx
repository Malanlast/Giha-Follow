import { useEffect, useState } from "react";
import axios from "axios";
import "./Repositories.css";
function Repositories() {
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => { 
        const fetchRepositories = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/users/github-repositories`,
                    { withCredentials: true }
                );

                setRepositories(response.data.repositories || []);
            } catch (error) {
                console.error(
                    "Failed to fetch repositories:",
                    error.response?.data || error.message
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRepositories();
    }, []);

    const getUpdatedTime = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

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
                {loading ? (
                    <p>Loading repositories...</p>
                ) : repositories.length === 0 ? (
                    <p>No public repositories found.</p>
                ) : (
                    repositories.map((repo) => (
                        <article className="repository-card" key={repo.id}>
                            <div className="repository-card-top">
                                <div className="repository-icon">
                                    <i className="bi bi-folder2-open"></i>
                                </div>

                                <span className="repository-public">
                                    <i className="bi bi-globe2"></i>
                                    {repo.visibility}
                                </span>
                            </div>

                            <h3>{repo.name}</h3>

                            <p className="repository-description">
                                {repo.description || "No description available."}
                            </p>

                            <div className="repository-language">
                                {repo.language && (
                                    <>
                                        <span className="language-dot"></span>
                                        {repo.language}
                                    </>
                                )}
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
                                    {getUpdatedTime(repo.updatedAt)}
                                </span>
                            </div>

                            <div className="repository-card-action">
                                <a
                                    href={repo.url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    View Repository
                                    <i className="bi bi-arrow-right"></i>
                                </a>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </section>
    );
}

export default Repositories;