import "../login.css";

function Login() {
    const loginWithGitHub = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/github`;
    };

    const features = [
          { icon: "bi-people-fill", title: "Discover Developers" },
          { icon: "bi-person-plus-fill", title: "Follow & Unfollow" },
          { icon: "bi-chat-dots-fill", title: "Real-time Messages" }
          ];

    return (
        <main className="login-page">

            {/* Navbar */}
            <nav className="login-navbar">
                <div className="brand-logo">
                    <img src="/GihaMainLogo.png" alt="Giha Follow" /> 
                </div>
                <button
                    className="nav-get-started"
                    onClick={loginWithGitHub}
                >
                    Get Started <i className="bi bi-arrow-right"></i>
                </button>
            </nav>

            {/* Hero */}
            <section className="hero-section">
                <div className="hero-content">
                    <span className="hero-badge">
                        <i className="bi bi-stars"></i>
                        A Better Way to Connect
                    </span>

                    <h1>
                        Connect. <span>Follow.</span> Grow.
                    </h1>

                    <h2>Discover GitHub Developers</h2>

                    <p>
                        Discover developers, follow your favourite GitHub
                        users, and become part of a growing developer
                        community.
                    </p>

                    <button
                        className="github-login-btn"
                        onClick={loginWithGitHub}
                    >
                        <i className="bi bi-github"></i>
                        Continue with GitHub
                        <i className="bi bi-arrow-right"></i>
                    </button>

                </div>
            </section>

            {/* Bottom Feature Bar */}
            <section className="feature-bar">
                {features.map((feature) => (
                    <div className="feature-item" key={feature.title}>
                        <i className={`bi ${feature.icon}`}></i>
                        <span>{feature.title}</span>
                    </div>
                ))}
            </section>

        </main>
    );
}

export default Login;