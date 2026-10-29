import FollowBtn from "./FollowBtn";
import axios from "axios";
import ChatDialog from "./ChatDialog.jsx";
import { useEffect, useState } from "react";
function FollowingUser({
    users,
    isfollowing,
    setIsfollowing,
    refreshFollowRequests,
    setNewUsers,
    setFollowingUsers
}) {
    const [mutualFollow, setMutualFollow] = useState({});
	const [selectedUser, setSelectedUser] = useState(null);
   useEffect(() => {
    if (users.length === 0) { 
        return;
    }
    const checkMutualFollow = async () => {
        try {
            const results = await Promise.all(
                users.map(async (user) => {
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
}, [users]);
    return (
        <>
            {
                users.map((user) => (
                    <div
                        className="col-6 col-md-3"
                        key={user._id}
                    >
                        <div className="card cardDesign position-relative">
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
                                    setNewUsers={setNewUsers}
                                    setFollowingUsers={setFollowingUsers}
                                />
                                {mutualFollow[user.username] && (
								<button
									className="btn chatBtn position-absolute top-0 end-0 m-2"
									onClick={() => setSelectedUser(user)}
								>	
                                <i className="bi bi-chat-dots-fill"></i>
								</button>
							)}
                            </div>
                        </div>
                    </div>
                ))
            }
			{selectedUser && (
				<ChatDialog
					user={selectedUser}
					onClose={() => setSelectedUser(null)}
				/>
			)}
        </>
    );
}

export default FollowingUser;