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
	}
	useEffect(()=>{ 
			checkFollowStatus(user.username);
	},[user.username]);
  return (
	<>
	{!isfollowing[user.username] && <button className="btn followBtn d-block mx-auto">
		Follow
	</button>}
	</>
  )
}

export default FollowBtn;