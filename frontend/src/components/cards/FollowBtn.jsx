import axios from "axios";
import { useEffect } from "react";

function FollowBtn({isfollowing, user, setIsfollowing}) {
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
	{!isfollowing[user.username] && <button
	onClick={()=>followUser(user.username)}
	className="btn followBtn d-block mx-auto">
		Follow
	</button>}
	</>
  )
}

export default FollowBtn;