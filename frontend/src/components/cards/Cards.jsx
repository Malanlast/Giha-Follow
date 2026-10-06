import './Cards.css';
import {io} from "socket.io-client";
import axios from "axios";
import { useEffect, useState, useRef } from "react"; 
import NewUsers from './NewUsers';
import FollowingUser from './FollowingUser';
import FollowRequest from './FollowRequest';
function Cards({activeList, isFollowRequest, setIsFollowRequest, setNewUserNotification}){
	const[currUser,setCurrUser]=useState(null);
	const[users,setUsers]=useState([]);
	const[apiError, setApiError] = useState(false);
	const[isfollowing, setIsfollowing]=useState({}); 
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
		const socket=io("http://localhost:5000");
		socket.on("newUser",(newUser)=>{
			setUsers(prev=>[...prev, newUser]);
			if(activeListRef.current!=="new"){
				setNewUserNotification(prev=>[...prev, newUser]);
			}
		});
		loadData();
		window.addEventListener("focus",loadFollowRequests);
		document.addEventListener("visibilitychange",loadFollowRequests);
		return()=>{
			socket.disconnect();
			window.removeEventListener("focus",loadFollowRequests);
			document.removeEventListener("visibilitychange",loadFollowRequests);
		}
	},[]);
	useEffect(() => {
    if (!currUser) return;
    const socket = io("http://localhost:5000");
    socket.on("followRequest", (data) => {
        if (data.targetUsername === currUser.username) {
            setIsFollowRequest(prev => {
                const alreadyExists = prev.some(
                    user => user.username === data.follower.username
                );
                if (alreadyExists) {
                    return prev;
                }
                return [...prev, data.follower];
            });
        }
    });
    return () => {
        socket.disconnect();
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
	const filteredUser=users
		.filter(user=>user._id !== currUser?._id)
		.filter(user=>{
			if(activeList==="new"){
				return !isfollowing[user.username];
			}
			if(activeList==="following"){
			return isfollowing[user.username];
			}
			return false;
        });
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
					activeList==="new"?
					"Waiting for new users"
					:"Following users not found"
				}
				</h2>
			</div>
		)
		:(<>
			{activeList==="new" &&(
			 <NewUsers
				users={users}
				currUser={currUser}
				isfollowing={isfollowing}
				setIsfollowing={setIsfollowing}
				refreshFollowRequests={loadFollowRequests}//passing function
			/>
			)}
			{activeList==="following" &&(
			 <FollowingUser
				users={users}
				currUser={currUser}
				isfollowing={isfollowing}
				setIsfollowing={setIsfollowing}
				refreshFollowRequests={loadFollowRequests}
			/>
			)}
			</>
		)
		)}
		</div>
		)
	};
export default Cards;