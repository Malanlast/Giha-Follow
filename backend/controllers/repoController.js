const axios = require("axios");

const searchRepositories = async (req, res) => {
    try {
        const { q, page = 1, limit = 10 } = req.query;

        const accessToken = req.session.githubAccessToken;

        if (!accessToken) {
            return res.status(401).json({
                message: "Github Authentication required",
            });
        }

        if (!q || !q.trim()) {
            return res.status(400).json({
                message: "Search query is required",
            });
        }

        const currentPage = Math.max(1, Number(page) || 1);
        const perPage = Math.min(50, Math.max(1, Number(limit) || 10));

        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

        const createdAfter = twoYearsAgo.toISOString().split("T")[0];

        const response = await axios.get(
            "https://api.github.com/search/repositories",
            {
                params: {
                    q: `${q.trim()} created:>${createdAfter}`,
                    sort: "updated",
                    order: "desc",
                    per_page: 100,
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: "application/vnd.github+json",
                },
            }
        );

        const repositories = response.data.items
            .filter((repo) => {
                return repo.description && repo.owner?.avatar_url;
            })
            .map((repo) => {
                const trendingScore =
                    repo.stargazers_count +
                    repo.forks_count +
                    repo.watchers_count;

                return {
                    name: repo.name,
                    username: repo.owner.login,
                    image: repo.owner.avatar_url,
                    about: repo.description,
                    createdDate: repo.created_at,
                    stars: repo.stargazers_count,
                    watchers: repo.watchers_count,
                    forks: repo.forks_count,
                    repositoryUrl: repo.html_url,
                    trendingScore,
                };
            })
            .sort((a, b) => b.trendingScore - a.trendingScore);

        const totalRepositories = repositories.length;
        const totalPages = Math.ceil(totalRepositories / perPage);

        const startIndex = (currentPage - 1) * perPage;

        const paginatedRepositories = repositories.slice(
            startIndex,
            startIndex + perPage
        );

        res.status(200).json({
            count: totalRepositories,
            currentPage,
            totalPages,
            hasNextPage: currentPage < totalPages,
            hasPreviousPage: currentPage > 1,
            repositories: paginatedRepositories,
        });

    } catch (err) {
        console.log(err.response?.data || err.message);

        res.status(500).json({
            message: "Failed to search repositories",
        });
    }
};

module.exports = {
    searchRepositories,
};