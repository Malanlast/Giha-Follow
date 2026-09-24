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
				console.log(response.data.user);
				setUser(response.data.user);
			}catch(err){
				console.log(err.response?.data || err.message);
			}
		};
		currentUser();
	},[]);
	const handleProfileUrl=()=>{
		console.log(user.profileUrl);
	}
	if(!user){
		return<h1>loading...</h1>
	}
  return (
	<div className='row' style={{background:" #4b4b4b",height:"20vh",color:"white",border:"1px solid #000000",boxShadow:"2px 5px 2px #ddd"}} >
		<div style={{height:"fit-content",marginTop:"1rem",display:"flex",justifyContent:"center"}}  className='col-3'>	
			<div style={{display:"flex",width:"fit-content",padding:"5px",justifyContent:"center",border:"1px solid #ddd"}}>
			<img src="/GihaLogo.png" style={{height:"35px",margin:"auto",marginRight:"7px"}} alt='logo'/>
			<p style={{fontSize:"0.9rem",letterSpacing:"0.5px",margin:"auto"}}><b>Giha Follow</b></p>
			</div>
		</div>
		<div style={{display:"flex",justifyContent:"center",height:"20vh"}}  className='col-4'>
			<img onClick={handleProfileUrl} src={user.avatar} style={{height:"19vh",margin:"auto",borderRadius:"50%",border:"1px solid #000000"}} alt={user.username}/>
		</div>
		<div style={{margin:"auto"}} className='col-5'>
			<div style={{display:"flex",padding:"5px",flexDirection:"column",border:"2px solid #ddd"}}>
				<h1 style={{fontSize:"1rem"}}>{user.name}</h1>
				<h2 style={{marginTop:"0",fontSize:"0.8rem"}}>{user.username}</h2>
				<p style={{fontSize:"0.7rem"}}>{user.bio}</p>
			</div>
		</div>
	</div>
  )
}

export default DashBoardNavbar;