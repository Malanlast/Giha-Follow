/* eslint-disable no-unused-vars */
import './Cards.css';
import axios from "axios";
import { socket } from "../../socket.js";
import { useEffect, useState, useRef, useCallback } from "react";

import NewUsers from './NewUsers';
import FollowingUser from './FollowingUser';
import FollowRequest from './FollowRequest';

function Cards({
    activeList,
    isFollowRequest,
    setIsFollowRequest,
    setNewUserNotification
}) {
    const [currUser, setCurrUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [apiError, setApiError] = useState(false);
    const [isfollowing, setIsfollowing] = useState({});
    const [newUsers, setNewUsers] = useState([]);
    const [followingUsers, setFollowingUsers] = useState([]);
    const [followersUsers, setFollowersUsers] = useState([]);

    const activeListRef = useRef(activeList);

    useEffect(() => {
        activeListRef.current = activeList;
    }, [activeList]);

    // Load follow requests
    const loadFollowRequests = useCallback(async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/users/follow-requests`,
                { withCredentials: true }
            );

            setIsFollowRequest(response.data.users);
        } catch (err) {
            console.log(err.response?.data || err.message);
        }
    }, [setIsFollowRequest]);

    // Load all initial data
    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            try {
                const [
                    currUserResponse,
                    usersResponse,
                    newUsersResponse,
                    followingResponse,
                    followersResponse,
                    requestsResponse
                ] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
                        withCredentials: true
                    }),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
                        withCredentials: true
                    }),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/users/new-users`, {
                        withCredentials: true
                    }),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/users/following`, {
                        withCredentials: true
                    }),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/users/followers`, {
                        withCredentials: true
                    }),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/users/follow-requests`, {
                        withCredentials: true
                    })
                ]);

                if (!isMounted) return;

                setCurrUser(currUserResponse.data.user);
                setUsers(usersResponse.data.users);
                setNewUsers(newUsersResponse.data.users);
                setFollowingUsers(followingResponse.data.users);
                setFollowersUsers(followersResponse.data.users);
                setIsFollowRequest(requestsResponse.data.users);

            } catch (err) {
                console.log(err.response?.data || err.message);

                if (isMounted) {
                    setApiError(true);
                }
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, [setIsFollowRequest]);

    // Centralized follow status fetching
    const loadFollowStatuses = useCallback(async () => {
        const allUsers = [
            ...newUsers,
            ...followingUsers,
            ...followersUsers,
            ...isFollowRequest
        ];

        const uniqueUsers = [
            ...new Map(
                allUsers.map(user => [user.username, user])
            ).values()
        ];

        const results = await Promise.all(
            uniqueUsers.map(async user => {
                try {
                    const response = await axios.get(
                        `${import.meta.env.VITE_API_URL}/api/users/${user.username}/follow-status`,
                        { withCredentials: true }
                    );

                    return [
                        user.username,
                        response.data.isFollowing
                    ];
                } catch (err) {
                    console.log(
                        user.username,
                        err.response?.data || err.message
                    );

                    return null;
                }
            })
        );

        setIsfollowing(prev => {
            const updated = { ...prev };

            results.forEach(result => {
                if (result) {
                    updated[result[0]] = result[1];
                }
            });

            return updated;
        });
    }, [newUsers, followingUsers, followersUsers, isFollowRequest]);

    // Fetch status when user lists change
    useEffect(() => {
    if (!currUser) return;

    const timer = setTimeout(() => {
        loadFollowStatuses();
    }, 0);

    return () => clearTimeout(timer);
    }, [currUser, loadFollowStatuses]);

    // Refresh statuses when page becomes active
    useEffect(() => {
        const handleFocus = () => {
            loadFollowStatuses();
            loadFollowRequests();
        };

        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                handleFocus();
            }
        };

        window.addEventListener("focus", handleFocus);
        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            window.removeEventListener("focus", handleFocus);
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, [loadFollowStatuses, loadFollowRequests]);

    // New user socket event
    useEffect(() => {
        const handleNewUser = (newUser) => {
            setUsers(prev =>
                prev.some(user => user.username === newUser.username)
                    ? prev
                    : [...prev, newUser]
            );

            setNewUsers(prev =>
                prev.some(user => user.username === newUser.username)
                    ? prev
                    : [...prev, newUser]
            );

            if (activeListRef.current !== "new") {
                setNewUserNotification(prev =>
                    prev.some(user => user.username === newUser.username)
                        ? prev
                        : [...prev, newUser]
                );
            }
        };

        socket.on("newUser", handleNewUser);

        return () => {
            socket.off("newUser", handleNewUser);
        };
    }, [setNewUserNotification]);

    // Follow request socket events
    useEffect(() => {
        if (!currUser) return;

        const handleFollowRequest = (data) => {
            if (data.targetUsername !== currUser.username) return;

            setIsFollowRequest(prev =>
                prev.some(user =>
                    user.username === data.follower.username
                )
                    ? prev
                    : [...prev, data.follower]
            );
        };

        const handleFollowBack = (data) => {
            if (data.targetUsername !== currUser.username) return;

            setIsFollowRequest(prev =>
                prev.filter(
                    user => user.username !== data.followedBackUser
                )
            );
        };

        const handleUnfollow = (data) => {
            if (data.targetUsername !== currUser.username) return;

            setIsFollowRequest(prev =>
                prev.filter(
                    user => user.username !== data.unfollower.username
                )
            );
        };

        socket.on("followRequest", handleFollowRequest);
        socket.on("followBack", handleFollowBack);
        socket.on("unfollow", handleUnfollow);

        return () => {
            socket.off("followRequest", handleFollowRequest);
            socket.off("followBack", handleFollowBack);
            socket.off("unfollow", handleUnfollow);
        };
    }, [currUser, setIsFollowRequest]);

    // Clear notification when New Users page is opened
    useEffect(() => {
        if (activeList === "new") {
            setNewUserNotification([]);
        }
    }, [activeList, setNewUserNotification]);

    if (apiError) {
        return (
            <div className="notFoundPage">
                <img
                    src="/noUser.png"
                    style={{ width: "10rem", marginBottom: "0" }}
                    alt="GitHub"
                />
                <p style={{ marginTop: "0", color: "white" }}>
                    Failed to fetch users....
                </p>
            </div>
        );
    }

    if (!currUser) {
        return <h1>Loading...</h1>;
    }

    return (
        <div
            className="cardContainer row g-2"
            style={{ marginTop: "0rem", padding: "5px" }}
        >
            {activeList === "new" && (
                <NewUsers
                    users={newUsers}
                    isfollowing={isfollowing}
                    setIsfollowing={setIsfollowing}
                    refreshFollowRequests={loadFollowRequests}
                    setNewUsers={setNewUsers}
                    setFollowingUsers={setFollowingUsers}
                >
                    {newUsers.length === 0 && (
                        <div className="notFoundPage">
                            <img
                                src="/noUser2.png"
                                alt="No users"
                            />
                            <h2>Waiting for New Users</h2>
                            <p>
                                New developers will appear here when they join
                                the GiHA Follow community.
                            </p>
                        </div>
                    )}
                </NewUsers>
            )}

            {activeList === "following" && (
                <FollowingUser
                    bannerType="following"
                    users={followingUsers}
                    isfollowing={isfollowing}
                    setIsfollowing={setIsfollowing}
                    refreshFollowRequests={loadFollowRequests}
                    setNewUsers={setNewUsers}
                    setFollowingUsers={setFollowingUsers}
                >
                    {followingUsers.length === 0 && (
                        <div className="notFoundPage">
                            <img
                                src="/noUser2.png"
                                alt="No following users"
                            />
                            <h2>You Are Not Following Anyone Yet</h2>
                            <p>
                                Discover developers and follow them to build
                                your network.
                            </p>
                        </div>
                    )}
                </FollowingUser>
            )}

            {activeList === "followers" && (
                <FollowingUser
                    bannerType="followers"
                    users={followersUsers}
                    isfollowing={isfollowing}
                    setIsfollowing={setIsfollowing}
                    refreshFollowRequests={loadFollowRequests}
                    setNewUsers={setNewUsers}
                    setFollowingUsers={setFollowingUsers}
                >
                    {followersUsers.length === 0 && (
                        <div className="notFoundPage">
                            <img
                                src="/noUser2.png"
                                alt="No followers"
                            />
                            <h2>No Followers Yet</h2>
                            <p>
                                Your followers will appear here when
                                developers connect with you.
                            </p>
                        </div>
                    )}
                </FollowingUser>
            )}

            {activeList === "follow-requests" && (
                <FollowRequest
                    isFollowRequest={isFollowRequest}
                    setIsFollowRequest={setIsFollowRequest}
                    setIsfollowing={setIsfollowing}
                    isfollowing={isfollowing}
                    setNewUsers={setNewUsers}
                    setFollowingUsers={setFollowingUsers}
                />
            )}
        </div>
    );
}

export default Cards;