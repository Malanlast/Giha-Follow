import './DashboardNavbar.css';
import { socket } from "../../socket.js";
import { useState } from "react";
import axios from 'axios';
import RepoDialogBox from "../repository/RepoDialogBox.jsx";
function DashBoardNavbar({ user }) {
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const handleLogout = async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/logout`,
                {},
                { withCredentials: true }
            );
            socket.disconnect();
            window.location.href = "/";
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };
    return (
        <header className="dashboard-topbar">

            {/* Profile image */}
            <div className="topbar-avatar">
                <img
                    onClick={() => window.open(
                        user.profileUrl,
                        "_blank",
                        "noopener,noreferrer"
                    )}
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

            {/* Repository search */}
            <div className="topbar-repository">
                <RepoDialogBox />
            </div>

            {/* Logout */}
            <button
                className="topbar-logout"
                onClick={() => setShowLogoutDialog(true)}
                title="Logout"
                type="button"
            >
                <i className="bi bi-box-arrow-right"></i>
            </button>
            {showLogoutDialog && (
                <div className="logout-overlay">
                    <div className="logout-dialog">
                        <div className="logout-icon">
                            <i className="bi bi-box-arrow-right"></i>
                        </div>

                        <h3>Confirm Logout</h3>
                        <p>Are you sure you want to logout from GiHA Follow?</p>

                        <div className="logout-dialog-actions">
                            <button
                                onClick={() => setShowLogoutDialog(false)}
                                className="logout-cancel"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleLogout}
                                className="logout-confirm"
                            >
                                Yes, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </header>
    );
}

export default DashBoardNavbar;