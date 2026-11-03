import './Overview.css';

function Overview() {
  return (
    <div className="container-fluid overview-container">
      <section className="overview-banner">
        <div className="banner-overlay"></div>

        <div className="banner-content">
          <span className="banner-tag">
            <i className="bi bi-stars"></i>
            Developer Community
          </span>

          <h1>
            Welcome back, <span>Shivam!</span> 👋
          </h1>

          <h2>Connect. Follow. Grow.</h2>

          <p>
            Stay updated with developers, repositories,
            <br className="d-none d-md-block" />
            and the community you care about.
          </p>

          <button className="btn banner-btn">
            Explore GitHub
            <i className="bi bi-arrow-right ms-2"></i>
          </button>
        </div>
      </section>
    </div>
  );
}

export default Overview;