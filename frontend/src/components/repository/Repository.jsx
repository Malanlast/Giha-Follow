import './SearchRepo.css';
import { useEffect, useState } from "react";
import axios from "axios";

function Repository() {
    const [query, setQuery] = useState("");
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const modal = document.getElementById("exampleModal");

        const handleClose = () => {
            setQuery("");
            setRepos([]);
            setCurrentPage(1);
            setTotalPages(0);
            setHasNextPage(false);
            setHasPreviousPage(false);
            setError("");
        };

        modal?.addEventListener("hidden.bs.modal", handleClose);

        return () => {
            modal?.removeEventListener("hidden.bs.modal", handleClose);
        };
    }, []);

    const searchRepository = async (page = 1) => {
        if (!query.trim()) return;

        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/repos/search?q=${encodeURIComponent(query)}&page=${page}&limit=10`,
                {
                    withCredentials: true
                }
            );

            const data = response.data;

            setRepos(data.repositories || []);
            setCurrentPage(data.currentPage || page);
            setTotalPages(data.totalPages || 0);
            setHasNextPage(data.hasNextPage || false);
            setHasPreviousPage(data.hasPreviousPage || false);

        } catch (err) {
            console.log(err.response?.data || err.message);
            setRepos([]);
            setError(
                err.response?.data?.message || "Failed to search repositories."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        searchRepository(1);
    };

    return (
        <div className="container-fluid repo-container">

            <div className="searchBox">
                <input
                    className="repository-search-input"
                    type="text"
                    placeholder="Search repositories..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />

                <button
                    className="searchBtn"
                    type="button"
                    onClick={handleSearch}
                    disabled={loading}
                >
                    <i className="bi bi-search"></i>
                </button>
            </div>

            {loading && (
                <p className="repo-status">Searching repositories...</p>
            )}

            {!loading && error && (
                <p className="repo-error">{error}</p>
            )}

            {!loading && !error && repos.length === 0 && (
                <p className="repo-status">
                    Search repositories to see results.
                </p>
            )}

            <div className="repo-list">
                {repos.map((repo) => (
                    <div
                        key={repo.repositoryUrl}
                        className="repo-card"
                    >
                        <div className="repo-owner">
                            <img
                                src={repo.image}
                                alt={repo.username}
                                onClick={() =>
                                    window.open(repo.repositoryUrl, "_blank")
                                }
                            />

                            <span>@{repo.username}</span>
                        </div>

                        <div className="repo-details">
                            <h5>{repo.name}</h5>

                            <p className="repo-description">
                                {repo.about}
                            </p>

                            <div className="repo-stats">
                                <span>
                                    <i className="bi bi-star-fill"></i>
                                    {repo.stars}
                                </span>

                                <span>
                                    <i className="bi bi-diagram-2-fill"></i>
                                    {repo.forks}
                                </span>

                                <span>
                                    <i className="bi bi-eye-fill"></i>
                                    {repo.watchers}
                                </span>
                            </div>

                            <p className="repo-date">
                                Created:{" "}
                                {new Date(repo.createdDate).toLocaleDateString()}
                            </p>

                            <a
                                href={repo.repositoryUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="repo-view-link"
                            >
                                View Repository
                                <i className="bi bi-box-arrow-up-right"></i>
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {!loading && repos.length > 0 && (
                <div className="repo-pagination">
                    <button
                        type="button"
                        disabled={!hasPreviousPage}
                        onClick={() => searchRepository(currentPage - 1)}
                    >
                        <i className="bi bi-chevron-left"></i>
                        Previous
                    </button>

                    <span>
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        type="button"
                        disabled={!hasNextPage}
                        onClick={() => searchRepository(currentPage + 1)}
                    >
                        Next
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
            )}

        </div>
    );
}

export default Repository;
