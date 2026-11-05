const languageColors = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    HTML: "#e34c26",
    CSS: "#563d7c",
    "C++": "#f34b7d",
    Python: "#3572A5",
    Java: "#b07219",
    PHP: "#4F5D95",
    EJS: "#a91e50",
    Go: "#00ADD8",
    Rust: "#dea584",
    Ruby: "#701516",
    Shell: "#89e051"
};

export const getLanguageColor = (language) => {
    return languageColors[language] || "#8b5cf6";
};