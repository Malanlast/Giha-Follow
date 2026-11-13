
import "./Cards.css";

function UserSearch({ value, onChange, placeholder = "Search developers..." }) {
    return (
        <div className="user-search-container">
            <div className="user-search-box">
                <i className="bi bi-search"></i>

                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                />

                {value && (
                    <button
                        type="button"
                        onClick={() => onChange("")}
                        aria-label="Clear search"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                )}
            </div>
        </div>
    );
}

export default UserSearch;
