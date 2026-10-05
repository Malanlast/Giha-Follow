import './Cards.css';
import axios from "axios";
import { useEffect, useState } from "react"; 
import NewUsers from './NewUsers';
import FollowingUser from './FollowingUser';
function Cards({activeList}){
	const[currUser,setCurrUser]=useState(null);
	const[users,setUsers]=useState([]);
	const[apiError, setApiError] = useState(false);
	const[isfollowing, setIsfollowing]=useState({});
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
		}catch(err){
			console.log(err.currUserResponse?.data||err.message);
			setApiError(true);
		}
		};
		loadData();
	},[]); 
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
			return isfollowing[user.username];
        });
	return(
		<div className="cardContainer row g-2" style={{marginTop:"0rem",padding:"5px"}}>
		{
			filteredUser.length===0?
		(
			<div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
				<img
					style={{height:"50vh"}}
				src='/noUser2.png' alt='no user'/>
				<h2 style={{fontSize:"1rem"}}>
				{
					activeList==="new"?
					"Waiting for new users"
					:activeList==="follow-requests"?
					"No following request yet":
					"Following users not found"
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
			/>
			)}
			{activeList==="following" &&(
			 <FollowingUser
				users={users}
				currUser={currUser}
				isfollowing={isfollowing}
				setIsfollowing={setIsfollowing}
			/>
			)}
			</>
		)
		}
		</div>
		)
	};
export default Cards;