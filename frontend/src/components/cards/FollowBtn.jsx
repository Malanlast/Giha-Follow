import axios from "axios";
import { useState } from "react";

function FollowBtn({
    isfollowing,
    user,
    setIsfollowing,
    setIsFollowRequest,
    refreshFollowRequests,
    setNewUsers,
    setFollowingUsers
}) {
    const [loading, setLoading] = useState(false);

    const followUser = async (username) => {
        if (loading) return;

        setLoading(true);

        try {
            await axios.put(
                `${import.meta.env.VITE_API_URL}/api/users/${username}/follow`,
                {},
                {
                    withCredentials: true,
                }
            );

            setIsfollowing((prev) => ({
                ...prev,
                [username]: true,
            }));

            // Remove from New Users
            setNewUsers((prev) =>
                prev.filter((u) => u.username !== username)
            );

            // Add to Following
            setFollowingUsers((prev) =>
                prev.some((u) => u.username === username)
                    ? prev
                    : [...prev, user]
            );

            // Remove from Follow Requests
            if (setIsFollowRequest) {
                setIsFollowRequest((prev) =>
                    prev.filter((u) => u.username !== username)
                );
            }
        } catch (err) {
            console.error(
                err.response?.data || err.message
            );
        } finally {
            setLoading(false);
        }
    };

    const unfollowUser = async (username) => {
        if (loading) return;

        setLoading(true);

        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/users/${username}/unfollow`,
                {
                    withCredentials: true,
                }
            );

            setIsfollowing((prev) => ({
                ...prev,
                [username]: false,
            }));

            // Remove from Following
            setFollowingUsers((prev) =>
                prev.filter((u) => u.username !== username)
            );

            // Add back to New Users
            setNewUsers((prev) =>
                prev.some((u) => u.username === username)
                    ? prev
                    : [...prev, user]
            );

            // Refresh Follow Requests
            if (refreshFollowRequests) {
                await refreshFollowRequests();
            }
        } catch (err) {
            console.error(
                err.response?.data || err.message
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={() =>
                isfollowing[user.username]
                    ? unfollowUser(user.username)
                    : followUser(user.username)
            }
            disabled={loading}
            className={`btn ${
                isfollowing[user.username]
                    ? "unfollowBtn"
                    : "followBtn"
            } d-block mx-auto`}
        >
            {loading
                ? "Please wait..."
                : isfollowing[user.username]
                ? "Unfollow"
                : "Follow"}
        </button>
    );
}

export default FollowBtn;