import { useEffect, useState } from "react";
import axios from "axios";
import "./Contributions.css";

function getStreaks(days) {
    const dates = days
        .filter(day => day.contributionCount > 0)
        .map(day => day.date)
        .sort();

    if (!dates.length) {
        return { longestStreak: 0, currentStreak: 0 };
    }

    const dateSet = new Set(dates);
    let longestStreak = 0;
    let streak = 0;

    dates.forEach((date, index) => {
        const previous = new Date(date);
        previous.setUTCDate(previous.getUTCDate() - 1);

        if (index > 0 && dateSet.has(previous.toISOString().slice(0, 10))) {
            streak++;
        } else {
            streak = 1;
        }

        longestStreak = Math.max(longestStreak, streak);
    });

    let currentStreak = 0;
    const today = new Date();

    // Count backward from today, or yesterday if today has no contributions
    if (!dateSet.has(today.toISOString().slice(0, 10))) {
        today.setUTCDate(today.getUTCDate() - 1);
    }

    while (dateSet.has(today.toISOString().slice(0, 10))) {
        currentStreak++;
        today.setUTCDate(today.getUTCDate() - 1);
    }

    return { longestStreak, currentStreak };
}

function getLevel(count) {
    if (count === 0) return 0;
    if (count <= 3) return 1;
    if (count <= 6) return 2;
    return 3;
}

function Contributions() {
    const [contributions, setContributions] = useState([]);
    const [totalContributions, setTotalContributions] = useState(0);
    const [streaks, setStreaks] = useState({
        longestStreak: 0,
        currentStreak: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContributions = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/users/github-contributions`,
                    { withCredentials: true }
                );

                const weeks = response.data.weeks || [];

                const days = weeks.flatMap(week =>
                    week.contributionDays
                );

                setContributions(days);
                setTotalContributions(response.data.totalContributions || 0);
                setStreaks(getStreaks(days));

            } catch (error) {
                console.error(
                    "Failed to fetch contributions:",
                    error.response?.data || error.message
                );
            } finally {
                setLoading(false);
            }
        };

        fetchContributions();
    }, []);

    const contributionWeeks = [];

    for (let i = 0; i < contributions.length; i += 7) {
        contributionWeeks.push(contributions.slice(i, i + 7));
    }

    return (
        <section className="contributions-section">
            <div className="contributions-header">
                <div>
                    <h2>Your Contributions</h2>
                    <p>Your coding activity and consistency</p>
                </div>

                <span className="contribution-year">
                    <i className="bi bi-calendar3"></i>
                    Last 1 Year
                </span>
            </div>

            <div className="contribution-stats">
                <div className="contribution-stat-card">
                    <div className="stat-icon">
                        <i className="bi bi-code-slash"></i>
                    </div>
                    <div>
                        <p>Total Contributions</p>
                        <h3>
                            {loading ? "..." : totalContributions.toLocaleString("en-IN")}
                        </h3>
                    </div>
                </div>

                <div className="contribution-stat-card">
                    <div className="stat-icon streak-icon">
                        <i className="bi bi-fire"></i>
                    </div>
                    <div>
                        <p>Longest Streak</p>
                        <h3>
                            {loading ? "..." : `${streaks.longestStreak} Days`}
                        </h3>
                    </div>
                </div>

                <div className="contribution-stat-card">
                    <div className="stat-icon current-icon">
                        <i className="bi bi-lightning-charge"></i>
                    </div>
                    <div>
                        <p>Current Streak</p>
                        <h3>
                            {loading ? "..." : `${streaks.currentStreak} Days`}
                        </h3>
                    </div>
                </div>
            </div>
<div className="contribution-activity">
    <div className="activity-heading">
        <h3>Contribution Activity</h3>
        <span>
            {loading
                ? "Loading contributions..."
                : `${totalContributions.toLocaleString("en-IN")} contributions in the last year`}
        </span>
    </div>

    <div className="heatmap-scroll">
        <div className="heatmap-container">

            {/* Month labels */}
            <div className="heatmap-months">
                <div className="day-label-space"></div>

                {contributionWeeks.map((week, index) => {
                    const firstDay = week[0];

                    if (!firstDay) return null;

                    const currentMonth = new Date(firstDay.date)
                        .toLocaleString("en-US", { month: "short", timeZone: "UTC" });

                    const previousMonth = index > 0
                        ? new Date(contributionWeeks[index - 1][0].date)
                            .toLocaleString("en-US", { month: "short", timeZone: "UTC" })
                        : "";

                    return (
                        <div className="month-label" key={index}>
                            {currentMonth !== previousMonth ? currentMonth : ""}
                        </div>
                    );
                })}
            </div>

            <div className="heatmap-body">

                {/* Day labels */}
                <div className="heatmap-days">
                    <span></span>
                    <span>Mon</span>
                    <span></span>
                    <span>Wed</span>
                    <span></span>
                    <span>Fri</span>
                    <span></span>
                </div>

                {/* Contribution cells */}
                <div className="heatmap">
                    {contributionWeeks.map((week, weekIndex) => (
                        <div className="heatmap-week" key={weekIndex}>
                            {week.map(day => {
                                const level = getLevel(day.contributionCount);

                                return (
                                    <div
                                        key={day.date}
                                        className={`heatmap-cell level-${level}`}
                                        title={`${day.contributionCount} contributions on ${day.date}`}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>

    <div className="heatmap-legend">
        <span>Less</span>
        <div className="heatmap-cell level-0" />
        <div className="heatmap-cell level-1" />
        <div className="heatmap-cell level-2" />
        <div className="heatmap-cell level-3" />
        <span>More</span>
    </div>
</div>
        </section>
    );
}

export default Contributions;