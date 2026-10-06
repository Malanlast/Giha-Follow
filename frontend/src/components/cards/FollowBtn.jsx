import axios from "axios";
import { useEffect } from "react";

function FollowBtn({isfollowing, user, setIsfollowing, setIsFollowRequest, refreshFollowRequests}) {
	const checkFollowStatus=async(username)=>{
		try{
			const response=await axios.get(
				`http://localhost:5000/api/users/${username}/follow-status`,
				{
					withCredentials:true,
				}
			);
			setIsfollowing((prev)=>({
				...prev,
				[username]:response.data.isFollowing,
			}));
		}catch(err){
			console.log(err.response?.data||err.message);
		}
	};
	const followUser=async(username)=>{
		try{
			await axios.put(
				`http://localhost:5000/api/users/${username}/follow`,
				{},
				{
					withCredentials:true,
				}
			);
			setIsfollowing((prev)=>({
				...prev,
				[username]:true,
			}));
			if(setIsFollowRequest){
			setIsFollowRequest((prev)=>
			prev.filter(user=>user.username!==username));
		}
		}catch(err){
			console.log(err.response?.data||err.message);
		}
	}
		const unfollowUser=async(username)=>{
		try{
			await axios.delete(
				`http://localhost:5000/api/users/${username}/unfollow`,
				{
					withCredentials:true,
				}
			);
			setIsfollowing((prev)=>({
				...prev,
				[username]:false,
			}));
			if(refreshFollowRequests){
				await refreshFollowRequests();
			}
		}catch(err){
			console.log(err.response?.data||err.message);
		}
	}
	useEffect(()=>{ 
			const updateStatus=()=>{
				checkFollowStatus(user.username);
			};
			updateStatus();  
			window.addEventListener("focus",updateStatus);
			document.addEventListener("visibilitychange",updateStatus);
			return()=>{
				window.removeEventListener("focus",updateStatus);
				document.removeEventListener("visibilitychange",updateStatus);
			};
	},[user.username]);
  return (
	<>
	{!isfollowing[user.username]?
	(<button
	onClick={()=>followUser(user.username)}
	className="btn followBtn d-block mx-auto">
		Follow
	</button>):(
		<button
	onClick={()=>unfollowUser(user.username)}
	className="btn unfollowBtn d-block mx-auto">
		Unfollow
	</button>
	)
	}
	</>
  )
}

export default FollowBtn;