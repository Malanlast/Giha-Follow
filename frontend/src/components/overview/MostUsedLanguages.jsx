import { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import { getLanguageColor } from "./languageConfig";
import "./MostUsedLanguages.css";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

// Text displayed in the center of the doughnut
const centerTextPlugin = {
    id: "centerText",

    afterDraw(chart) {
        const { ctx, chartArea } = chart;

        if (!chartArea) return;

        const centerX = (chartArea.left + chartArea.right) / 2;
        const centerY = (chartArea.top + chartArea.bottom) / 2;

        ctx.save();

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.font = "bold 27px sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(
            chart.data.datasets[0].data.length,
            centerX,
            centerY - 7
        );

        ctx.font = "11px sans-serif";
        ctx.fillStyle = "#929bb3";
        ctx.fillText(
            "Languages",
            centerX,
            centerY + 16
        );

        ctx.restore();
    }
};

function MostUsedLanguages() {
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/users/github-languages`,
                    { withCredentials: true }
                );

                setLanguages(response.data.languages || []);

            } catch (error) {
                console.error(
                    "Failed to fetch GitHub languages:",
                    error.response?.data || error.message
                );

                setError(true);

            } finally {
                setLoading(false);
            }
        };

        fetchLanguages();
    }, []);

    const chartData = {
        labels: languages.map((language) => language.name),

        datasets: [
            {
                data: languages.map((language) => language.percentage),

                backgroundColor: languages.map((language) =>
                    getLanguageColor(language.name)
                ),

                borderColor: "#0b1020",
                borderWidth: 3,
                hoverOffset: 8,
                borderRadius: 4,
                spacing: 2
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "72%",

        plugins: {
            legend: {
                display: false
            },

            tooltip: {
                backgroundColor: "#151d32",
                titleColor: "#ffffff",
                bodyColor: "#cbd5e1",
                padding: 12,

                callbacks: {
                    label: (context) => {
                        const language = languages[context.dataIndex];

                        return ` ${language.name}: ${language.percentage}%`;
                    }
                }
            }
        }
    };

    return (
        <section className="languages-section">

            <div className="languages-header">
                <div>
                    <h2>Most Used Languages</h2>
                    <p>Language distribution across your GitHub repositories</p>
                </div>

                <div className="languages-header-icon">
                    <i className="bi bi-code-slash"></i>
                </div>
            </div>

            {loading ? (
                <div className="languages-message">
                    Loading language statistics...
                </div>
            ) : error ? (
                <div className="languages-message">
                    Failed to load language statistics.
                </div>
            ) : languages.length === 0 ? (
                <div className="languages-message">
                    No language data available.
                </div>
            ) : (
                <div className="languages-content">

                    <div className="languages-chart">
                        <Doughnut
                            data={chartData}
                            options={chartOptions}
                            plugins={[centerTextPlugin]}
                        />
                    </div>

                    <div className="languages-legend">
                        {languages.map((language) => (
                            <div
                                className="language-item"
                                key={language.name}
                            >
                                <div className="language-name">
                                    <span
                                        className="language-color"
                                        style={{
                                            backgroundColor: getLanguageColor(
                                                language.name
                                            )
                                        }}
                                    ></span>

                                    <span>{language.name}</span>
                                </div>

                                <div className="language-details">
                                    <strong>
                                        {language.percentage}%
                                    </strong>

                                    <span>
                                        {language.bytes.toLocaleString("en-IN")} bytes
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            )}

        </section>
    );
}

export default MostUsedLanguages;