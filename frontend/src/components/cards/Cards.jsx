import './Cards.css';
import axios from "axios";
import { useEffect, useState } from "react";
function Cards(){
	const[currUser,setCurrUser]=useState(null);
	const[users,setUsers]=useState([]);
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
		}
		};
		loadData();
	},[]);
	if(!currUser){
		return(
			<div className="notFoundPage">
				<img src="/noUser.png" style={{width:"10rem",marginBottom:"0"}} alt="gitHub"/>
				<p style={{marginTop:"0",color:"white"}}>Failed to fetch users....</p>
			</div>
		)
	}
	return(
		<div className="cardContainer row g-2" style={{marginTop:"1rem",padding:"5px"}}>
		{
		users.filter(user=>user._id !== currUser._id).map((user)=>(
		<div className="col-6 col-md-3 " key={user._id}>
		<div className='card cardDesign'>
		<img src={user.avatar} alt={user.username} className='card-img-top'/>
		<div className="card-body">
			<h4 className="card-title">{user.name}</h4>
			<h5 className="card-subtitle mb-2 text-body-secondary">{user.username}</h5>
			<p className="card-text">{user.bio}</p>
			<button className="btn followBtn d-block mx-auto">Follow</button>
		</div>
		</div>
		</div>
		))}
		</div>
		)
	};
export default Cards;