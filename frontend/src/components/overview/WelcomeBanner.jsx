import "./Welcome.css";

function WelcomeBanner({ user }) {
    return (
        <section className="overview-banner">
            <div className="banner-overlay"></div>

            <div className="banner-content">
                <span className="banner-tag">
                    <i className="bi bi-stars"></i>
                    Developer Community
                </span>

                <h1>
                    Welcome  <span>{user?.name || user?.username}!</span>
                </h1>

                <h2>Connect. Follow. Grow.</h2>

                <p>
                    Stay updated with developers, repositories,
                    <br className="d-none d-md-block" />
                    and the community you care about.
                </p>

                <button
                    className="btn banner-btn"
                    type="button"
                    onClick={() =>
                        window.open(user?.profileUrl, "_blank", "noopener,noreferrer")
                    }
                >
                    Explore GitHub
                    <i className="bi bi-arrow-right ms-2"></i>
                </button>
            </div>
        </section>
    );
}

export default WelcomeBanner;