import './DashboardNavbar.css';
import { socket } from "../../socket.js";
import axios from 'axios';
import { useEffect, useState } from 'react';

function DashBoardNavbar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:5000/api/users/me',
                    {
                        withCredentials: true,
                    }
                );

                setUser(response.data.user);
            } catch (err) {
                console.log(err.response?.data || err.message);
            }
        };

        currentUser();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post(
                "http://localhost:5000/api/auth/logout",
                {},
                { withCredentials: true }
            );

            socket.disconnect();
            window.location.href = "/";
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };

    if (!user) {
        return <div className="dashboard-topbar-loading">Loading...</div>;
    }

    return (
        <header className="dashboard-topbar">
            {/* Profile image */}
            <div className="topbar-avatar">
                <img
                    onClick={() => window.open(user.profileUrl, "_blank")}
                    src={user.avatar}
                    alt={user.username}
                    title="View GitHub Profile"
                />
            </div>

            {/* User details */}
            <div className="topbar-user-details">
                <h2>{user.name}</h2>
                <span>@{user.username}</span>
                <p>
                    {user.bio || "GitHub Developer"}
                </p>
            </div>

            {/* Logout */}
            <button
                className="topbar-logout"
                onClick={handleLogout}
                title="Logout"
                type="button"
            >
                <i className="bi bi-box-arrow-right"></i>
            </button>

        </header>
    );
}

export default DashBoardNavbar;