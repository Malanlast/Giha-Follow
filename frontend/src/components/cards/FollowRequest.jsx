import { useState } from "react";
import FollowBtn from "./FollowBtn";
import "./FollowRequest.css";
import UserSearch from "./UserSearch";
function FollowRequest({
    isFollowRequest,
    isfollowing,
    setIsfollowing,
    setIsFollowRequest,
    setNewUsers,
    setFollowingUsers
}) {
    const [search, setSearch]=useState("");
    const pendingRequests = isFollowRequest.filter(
        user => !isfollowing[user.username]
    );
    const filteredRequests=pendingRequests.filter((user)=>{
        const value=search.toLowerCase();
        return(
            user.name?.toLowerCase().includes(value) ||
            user.username?.toLowerCase().includes(value)
        );
    });

    return (
        <div className="follow-requests-page">

            {/* Banner */}
            <div className="requests-banner">
                <div className="requests-banner-content">
                    <span className="requests-banner-tag">
                        <i className="bi bi-people-fill"></i>
                        Your Community
                    </span>

                    <h1>
                        Follow <span>Requests!</span>
                    </h1>

                    <h2>Build Your Network.</h2>

                    <p>
                        Discover developers who want to connect with you.
                        Follow them back and grow your developer community.
                    </p>

                    <div className="requests-banner-stats">
                        <div className="requests-stat">
                            <i className="bi bi-person-plus-fill"></i>
                            <div>
                                <strong>{pendingRequests.length}</strong>
                                <span>Pending Requests</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="requests-banner-icon">
                    <i className="bi bi-people-fill"></i>
                </div>
            </div>

            {/* Section Heading */}
            <div className="requests-section-heading">
                <div>
                    <h3>People Who Want to Connect</h3>
                    <p>Explore your follow requests and connect with developers.</p>
                </div>

                <span className="requests-count">
                    {pendingRequests.length} Requests
                </span>
            </div>
            {pendingRequests.length>0&&(
                <UserSearch
                    value={search}
                    onChange={setSearch}
                    placeholder="Search follow requests..."
                />
            )}

            {/* Follow Request Cards */}
            {filteredRequests.length > 0 ? (
                <div className="row g-4">
                    {filteredRequests.map(user => (
                        <div
                            className="col-12 col-sm-6 col-md-4 col-lg-3"
                            key={user._id}
                        >
                            <div className="request-card">

                                <div className="request-card-image">
                                    <img
                                        src={user.avatar}
                                        alt={user.username}
                                        onClick={() =>
                                            window.open(
                                                user.profileUrl,
                                                "_blank"
                                            )
                                        }
                                    />

                                    <span className="request-status">
                                        <i className="bi bi-clock-fill"></i>
                                        Pending
                                    </span>
                                </div>

                                <div className="request-card-body">
                                    <h4>{user.name}</h4>

                                    <span className="request-username">
                                        @{user.username}
                                    </span>

                                    <p className="request-bio">
                                        {user.bio || "No bio available"}
                                    </p>

                                    <div className="request-card-action">
                                        <FollowBtn
                                            isfollowing={isfollowing}
                                            setIsFollowRequest={setIsFollowRequest}
                                            setIsfollowing={setIsfollowing}
                                            user={user}
                                            setNewUsers={setNewUsers}
                                            setFollowingUsers={setFollowingUsers}
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            ): pendingRequests.length>0?(
                <div className="no-requests">
                    <h3>No Requests Found</h3>
                    <p>Try searching with another name or username.</p>
                </div>
            ) : (
                <div className="no-requests">
                    <img
                        src="/noReq.png"
                        alt="No follow requests"
                    />

                    <h3>No Follow Requests Yet</h3>

                    <p>
                        When someone wants to connect with you,
                        their request will appear here.
                    </p>
                </div>
            )}

        </div>
    );
}

export default FollowRequest;