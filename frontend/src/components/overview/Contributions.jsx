import "./Contributions.css";

const contributionData = Array.from({ length: 52 }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => {
        const value = (week * 7 + day * 3) % 9;

        if (value < 3) return 0;
        if (value < 5) return 1;
        if (value < 7) return 2;
        return 3;
    })
);

function Contributions() {
    return (
        <section className="contributions-section">
            {/* Header */}
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

            {/* Statistics */}
            <div className="contribution-stats">
                <div className="contribution-stat-card">
                    <div className="stat-icon">
                        <i className="bi bi-code-slash"></i>
                    </div>
                    <div>
                        <p>Total Contributions</p>
                        <h3>1,248</h3>
                    </div>
                </div>

                <div className="contribution-stat-card">
                    <div className="stat-icon streak-icon">
                        <i className="bi bi-fire"></i>
                    </div>
                    <div>
                        <p>Longest Streak</p>
                        <h3>18 Days</h3>
                    </div>
                </div>

                <div className="contribution-stat-card">
                    <div className="stat-icon current-icon">
                        <i className="bi bi-lightning-charge"></i>
                    </div>
                    <div>
                        <p>Current Streak</p>
                        <h3>7 Days</h3>
                    </div>
                </div>
            </div>

            {/* Contribution Heatmap */}
            <div className="contribution-activity">
                <div className="activity-heading">
                    <h3>Contribution Activity</h3>
                    <span>1,248 contributions in the last year</span>
                </div>

                <div className="heatmap-scroll">
                    <div className="heatmap">
                        {contributionData.map((week, weekIndex) => (
                            <div className="heatmap-week" key={weekIndex}>
                                {week.map((level, dayIndex) => (
                                    <div
                                        key={dayIndex}
                                        className={`heatmap-cell level-${level}`}
                                        title={`${level === 0 ? "No" : level} contributions`}
                                    />
                                ))}
                            </div>
                        ))}
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