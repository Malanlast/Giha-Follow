import './Cards.css'; 
import axios from "axios";
import { socket } from "../../socket.js";
import { useEffect, useState, useRef } from "react"; 
import NewUsers from './NewUsers';
import FollowingUser from './FollowingUser';
import FollowRequest from './FollowRequest';
function Cards({activeList, isFollowRequest, setIsFollowRequest, setNewUserNotification}){
	const[currUser,setCurrUser]=useState(null);
	const[users,setUsers]=useState([]);
	const[apiError, setApiError] = useState(false);
	const[isfollowing, setIsfollowing]=useState({});
	const [newUsers, setNewUsers] = useState([]);
    const [followingUsers, setFollowingUsers] = useState([]);
	const [followersUsers, setFollowersUsers] = useState([]);
	const activeListRef=useRef(activeList);
	useEffect(()=>{
		activeListRef.current=activeList;
	},[activeList]);
	const loadFollowRequests=async()=>{
		try{
			const response=await axios.get(
				"http://localhost:5000/api/users/follow-requests",
				{
					withCredentials:true,
				}
			);
			setIsFollowRequest(response.data.users);
		}catch(err){
			console.log(err.response?.data||err.message);
		}
	};
	useEffect(()=>{
		const loadData=async()=>{
			try{
			const currUserResponse=await axios.get(
				'http://localhost:5000/api/users/me',
				{
					withCredentials:true,
				}
			);
			setCurrUser(currUserResponse.data.user);
		
			const usersResponse=await axios.get(
				'http://localhost:5000/api/users',
				{
					withCredentials:true,
				}
			);
			setUsers(usersResponse.data.users);
			const newUsersResponse = await axios.get(
			"http://localhost:5000/api/users/new-users",
			{
				withCredentials: true,
			}
		);
		setNewUsers(newUsersResponse.data.users);

		const followingUsersResponse = await axios.get(
			"http://localhost:5000/api/users/following",
			{
				withCredentials: true,
			}
		);
		setFollowingUsers(followingUsersResponse.data.users);
		const followersResponse = await axios.get(
			"http://localhost:5000/api/users/followers",
			{ withCredentials: true }
		);
		setFollowersUsers(followersResponse.data.users);

			const followRequest=await axios.get(
				`http://localhost:5000/api/users/follow-requests`,
				{
					withCredentials:true,
				}
			);
			setIsFollowRequest(followRequest.data.users);
		}catch(err){
			console.log(err.response?.data||err.message);
			setApiError(true);
		}
		};
		const handleNewUser = (newUser) => {
			setUsers(prev => [...prev, newUser]);

			if (activeListRef.current !== "new") {
				setNewUserNotification(prev => [...prev, newUser]);
			}
		};

		socket.on("newUser", handleNewUser);
		loadData();
		window.addEventListener("focus",loadFollowRequests);
		document.addEventListener("visibilitychange",loadFollowRequests);
		return () => {
			socket.off("newUser", handleNewUser);
			window.removeEventListener("focus", loadFollowRequests);
			document.removeEventListener("visibilitychange", loadFollowRequests);
		};
	},[]);
	useEffect(() => {
		if (!currUser) return;
		socket.on("followRequest", (data) => {
			if (data.targetUsername === currUser.username) {
				setIsFollowRequest(prev => {
					const alreadyExists = prev.some(
						user => user.username === data.follower.username
					);

					if (alreadyExists) return prev;
					return [...prev, data.follower];
				});
			}
		});

		socket.on("followBack", (data) => {
			if (data.targetUsername === currUser.username) {
				setIsFollowRequest(prev =>
					prev.filter(
						user => user.username !== data.followedBackUser
					)
				);
			}
		});

		socket.on("unfollow", (data) => {
			if (data.targetUsername === currUser.username) {
				setIsFollowRequest(prev =>
					prev.filter(
						user => user.username !== data.unfollower.username
					)
				);
			}
		});

		return () => {
			socket.off("followRequest");
			socket.off("followBack");
			socket.off("unfollow");
		};
	}, [currUser]);
	useEffect(()=>{
		if(activeList==="new"){
			setNewUserNotification([]);
		}
	},[activeList]);
	if(apiError){
		return(
			<div className="notFoundPage">
				<img src="/noUser.png" style={{width:"10rem",marginBottom:"0"}} alt="gitHub"/>
				<p style={{marginTop:"0",color:"white"}}>Failed to fetch users....</p>
			</div>
		)
	};
	if(!currUser){
	    return <h1>Loading...</h1>;
	};
	const filteredUser =
    activeList === "new"
        ? newUsers
        : activeList === "following"
        ? followingUsers
        : activeList === "followers"
        ? followersUsers
        : [];
	return(
		<div className="cardContainer row g-2" style={{marginTop:"0rem",padding:"5px"}}>
		{
			activeList==="follow-requests"?
			(
				<FollowRequest
					isFollowRequest={isFollowRequest}
					setIsFollowRequest={setIsFollowRequest}
					setIsfollowing={setIsfollowing}
					isfollowing={isfollowing}
					setNewUsers={setNewUsers}
                    setFollowingUsers={setFollowingUsers}
				/>
			):
			(filteredUser.length===0?
		(
			<div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
				<img
					style={{height:"50vh"}}
				src='/noUser2.png' alt='no user'/>
				<h2 style={{fontSize:"1rem"}}>
				{
					activeList === "new"
					? "Waiting for new users"
					: activeList === "followers"
					? "No followers found"
					: "Following users not found"
				}
				</h2>
			</div>
		)
		:(<>
			{activeList==="new" &&(
			 <NewUsers
				users={newUsers}
				currUser={currUser}
				isfollowing={isfollowing}
				setIsfollowing={setIsfollowing}
				refreshFollowRequests={loadFollowRequests}
				setNewUsers={setNewUsers}
				setFollowingUsers={setFollowingUsers}

			/>
			)}
			{activeList==="following" &&(
			 <FollowingUser
				users={followingUsers}
				currUser={currUser}
				isfollowing={isfollowing}
				setIsfollowing={setIsfollowing}
				refreshFollowRequests={loadFollowRequests}
				setNewUsers={setNewUsers}
				setFollowingUsers={setFollowingUsers}
			/>
			)}
			{activeList === "followers" && (
				<FollowingUser
					users={followersUsers}
					currUser={currUser}
					isfollowing={isfollowing}
					setIsfollowing={setIsfollowing}
					refreshFollowRequests={loadFollowRequests}
					setNewUsers={setNewUsers}
					setFollowingUsers={setFollowingUsers}
				/>
			)}
			</>
		)
		)}
		</div>
		)
	};
export default Cards;