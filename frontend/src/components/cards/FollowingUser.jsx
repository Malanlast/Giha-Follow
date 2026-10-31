import FollowBtn from "./FollowBtn"; 
import ChatDialog from "../chat/ChatDialog.jsx";
import { useState } from "react";
function FollowingUser({
    users,
    isfollowing,
    setIsfollowing,
    refreshFollowRequests,
    setNewUsers,
    setFollowingUsers
}){
   const [selectedUser, setSelectedUser] = useState(null);
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
                            <button
                                className="btn chatBtn position-absolute top-0 end-0 m-2"
                                onClick={() => setSelectedUser(user)}
                            >
                                <i className="bi bi-chat-dots-fill"></i>
                            </button>
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