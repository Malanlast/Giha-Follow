import "./loginComponent.css";

function DetailsBox() {
    const features = [
        {
            icon: "bi bi-people-fill",
            title: "Discover Developers",
            description:
                "Explore developers who have joined Giha Follow and discover new connections within the community."
        },
        {
            icon: "bi bi-person-plus-fill",
            title: "Follow & Unfollow",
            description:
                "Follow developers and manage your connections through authorized GitHub functionality."
        },
        {
            icon: "bi bi-person-vcard-fill",
            title: "Developer Profiles",
            description:
                "Explore GitHub profiles, including usernames, bios, followers, following, and repositories."
        },
        {
            icon: "bi bi-person-check-fill",
            title: "Follow Requests",
            description:
                "View incoming follow requests and build connections with other developers."
        },
        {
            icon: "bi bi-chat-dots-fill",
            title: "Real-time Messaging",
            description:
                "Chat with mutual connections through real-time messaging."
        },
        {
            icon: "bi bi-bell-fill",
            title: "Live Notifications",
            description:
                "Stay updated when new developers join and discover new activity."
        }
    ];

    return (
        <div className="row g-4 cardBox">
            {features.map((feature, index) => (
                <div className="col-12 col-md-6 col-lg-4" key={index}>
                    <div className="detailsCard h-100">
                        <div className="feature-icon">
                            <i className={feature.icon}></i>
                        </div>

                        <h3>{feature.title}</h3>

                        <p>{feature.description}</p>

                        <div className="feature-line"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default DetailsBox;