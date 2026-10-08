import FollowBtn from "./FollowBtn";
import axios from "axios";
import { useEffect, useState } from "react";
function FollowingUser({
    users,
    currUser,
    isfollowing,
    setIsfollowing,
    refreshFollowRequests
}) {
    const [mutualFollow, setMutualFollow] = useState({});
    const followingUsers = users
        .filter(user => user._id !== currUser._id)
        .filter(user => isfollowing[user.username]);
   useEffect(() => {
    if (followingUsers.length === 0) {
        return;
    }
    const checkMutualFollow = async () => {
        try {
            const results = await Promise.all(
                followingUsers.map(async (user) => {
                    const response = await axios.get(
                        `http://localhost:5000/api/users/${user.username}/mutual-follow`,
                        {
                            withCredentials: true,
                        }
                    );
                    return {
                        username: user.username,
                        isMutualFollow: response.data.isMutualFollow,
                    };
                })
            );
            const mutualStatus = {};
            results.forEach((result) => {
                mutualStatus[result.username] =
                    result.isMutualFollow;
            });
            setMutualFollow(mutualStatus);
        } catch (error) {
            console.log(
                error.response?.data || error.message
            );
        }
    };
    checkMutualFollow();
}, [users, isfollowing]);
    return (
        <>
            {
                followingUsers.map((user) => (
                    <div
                        className="col-6 col-md-3"
                        key={user._id}
                    >
                        <div className="card cardDesign">
                            <img
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                    window.open(user.profileUrl, "_blank")
                                }
                                src={user.avatar}
                                alt={user.username}
                                className="card-img-top"
                            />
                            <div className="card-body">
                                <h4 className="card-title">
                                    {user.name}
                                </h4>
                                <h5 className="card-subtitle mb-2 text-body-secondary">
                                    {user.username}
                                </h5>
                                <p className="card-text">
                                    {user.bio}
                                </p>
                                <FollowBtn
                                    isfollowing={isfollowing}
                                    user={user}
                                    setIsfollowing={setIsfollowing}
                                    refreshFollowRequests={refreshFollowRequests}
                                />
                                {mutualFollow[user.username] && (
                                    <button
                                        className="btn btn-outline-primary mt-2"
                                    >
                                        Chat
                                    </button>
                                )}

                            </div>
                        </div>
                    </div>
                ))
            }
        </>
    );
}

export default FollowingUser;