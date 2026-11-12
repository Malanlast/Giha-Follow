import "./SearchRepo.css";
import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";
const ITEMS_PER_PAGE = 6;

function Repository() {
    const [query, setQuery] = useState("");
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(repos.length / ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentRepos = repos.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
    );

    // Reset search when modal closes
    useEffect(() => {
        const modal = document.getElementById("exampleModal");

        const handleClose = () => {
            setQuery("");
            setRepos([]);
            setCurrentPage(1);
        };

        modal?.addEventListener("hidden.bs.modal", handleClose);

        return () => {
            modal?.removeEventListener("hidden.bs.modal", handleClose);
        };
    }, []);

    // Search repositories
    const searchRepository = async () => {
        if (!query.trim() || loading) return;

        try {
            setLoading(true);
            setRepos([]);
            setCurrentPage(1);

            const response = await axios.get(
                `${API}/api/repos/search?q=${encodeURIComponent(query.trim())}`,
                { withCredentials: true }
            );

            setRepos(response.data.repositories || []);
        } catch (error) {
            console.error(
                "REPOSITORY SEARCH ERROR:",
                error.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    };

    // Pagination
    const changePage = (page) => {
        if (page < 1 || page > totalPages) return;

        setCurrentPage(page);
    };

    return (
        <div className="repository-container">

            {/* Search */}
            <div className="searchBox">
                <input
                    className="repository-search-input"
                    type="text"
                    placeholder="Search repositories..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={(event) =>
                        event.key === "Enter" && searchRepository()
                    }
                />

                <button
                    className="searchBtn"
                    type="button"
                    onClick={searchRepository}
                    disabled={loading || !query.trim()}
                >
                    <i className="bi bi-search"></i>
                </button>
            </div>

            {/* Loading */}
            {loading && (
                <div className="repo-status">
                    <div className="spinner-border spinner-border-sm"></div>
                    <span>Searching repositories...</span>
                </div>
            )}

            {/* Empty State */}
            {!loading && repos.length === 0 && query.trim() && (
                <div className="repo-empty">
                    <i className="bi bi-search"></i>
                    <h5>No repositories found</h5>
                    <p>Try searching with another keyword.</p>
                </div>
            )}

            {/* Repository Cards */}
            {!loading && (
                <div className="repository-results">
                    {currentRepos.map((repo) => (
                        <div
                            className="repository-card"
                            key={repo.repositoryUrl}
                        >
                            <div className="repository-image">
                                <img
                                    src={repo.image}
                                    alt={repo.username}
                                    onClick={() =>
                                        window.open(
                                            repo.repositoryUrl,
                                            "_blank",
                                            "noopener,noreferrer"
                                        )
                                    }
                                />
                            </div>

                            <div className="repository-details">
                                <h5>{repo.name}</h5>

                                <span className="repo-username">
                                    @{repo.username}
                                </span>

                                <p className="repo-stars">
                                    <i className="bi bi-star-fill"></i>
                                    {repo.stars}
                                </p>

                                <p className="repo-about">
                                    {repo.about}
                                </p>

                                <span className="repo-date">
                                    <i className="bi bi-calendar3"></i>
                                    {new Date(
                                        repo.createdDate
                                    ).toLocaleDateString("en-IN")}
                                </span>

                                <a
                                    href={repo.repositoryUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="repo-view-btn"
                                >
                                    View Repository
                                    <i className="bi bi-arrow-up-right"></i>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="repo-pagination">
                    <button
                        type="button"
                        onClick={() => changePage(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                    >
                        <i className="bi bi-chevron-left"></i>
                    </button>

                    {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1
                    ).map((page) => (
                        <button
                            type="button"
                            key={page}
                            className={
                                currentPage === page ? "active" : ""
                            }
                            onClick={() => changePage(page)}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        type="button"
                        onClick={() => changePage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                    >
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
            )}

            {!loading && repos.length > 0 && (
                <p className="repo-result-count">
                    Showing {startIndex + 1}–
                    {Math.min(startIndex + ITEMS_PER_PAGE, repos.length)}
                    {" "}of {repos.length} repositories
                </p>
            )}
        </div>
    );
}

export default Repository;