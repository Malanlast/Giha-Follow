import './Dashboard.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
function DashBoardNavbar() {
	const[user, setUser]=useState(null);
	useEffect(()=>{ 
		const currentUser=async()=>{
			try{
				const response=await axios.get(
					'http://localhost:5000/api/users/me',
				{
					withCredentials:true,
				}); 
				setUser(response.data.user);
			}catch(err){
				console.log(err.response?.data || err.message);
			}
		};
		currentUser();
	},[]);
	const handleLogout=async()=>{
		try{
			await axios.post(
				`http://localhost:5000/api/auth/logout`,
				{},
				{
					withCredentials:true,
				}
			);
			window.location.href="/";
		}catch(err){
			console.log(err.response?.data||err.message);
		}
	}
	if(!user){
		return<h1 style={{background:"#cccbcb"}}>Loading...</h1>
	}
  return (
	<div className='row dashNav'>
		<div style={{height:"fit-content",marginTop:"1rem",display:"flex",justifyContent:"center"}}  className='col-3'>	
			<div className='logoContain'>
			<img src="/GihaLogo.png" style={{height:"35px",margin:"auto",marginRight:"7px"}} alt='logo'/>
			<p style={{fontSize:"0.9rem",letterSpacing:"0.5px",margin:"auto"}}><b>Giha Follow</b></p>
			</div>
		</div>
		<div className='col-4 imgContain'>
			<img onClick={()=>window.open(user.profileUrl,"_blank")} src={user.avatar} alt={user.username}/>
		</div>
		<div className='col-5 detailsBox'>
			<div>
				<h1 style={{fontSize:"1rem",margin:"0"}}>Name: {user.name}</h1>
				<h2 style={{marginTop:"0",fontSize:"0.8rem"}}>Username: {user.username}</h2>
				<p>Bio: {user.bio}</p>
			</div>
			<button
			onClick={handleLogout} className='btn btnLogout'>logout</button>
		</div> 
	</div>
  )
}

export default DashBoardNavbar;