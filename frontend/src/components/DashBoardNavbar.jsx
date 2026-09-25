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
				console.log(response.data.user);
				setUser(response.data.user);
			}catch(err){
				console.log(err.response?.data || err.message);
			}
		};
		currentUser();
	},[]);
	if(!user){
		return<h1>loading...</h1>
	}
  return (
	<div className='row' style={{background:" #222222",height:"20vh",color:"white",border:"1px solid #000000",boxShadow:"2px 5px 2px #ddd"}} >
		<div style={{height:"fit-content",marginTop:"1rem",display:"flex",justifyContent:"center"}}  className='col-3'>	
			<div style={{display:"flex",width:"fit-content",padding:"5px",justifyContent:"center",border:"1px solid #ddd"}}>
			<img src="/GihaLogo.png" style={{height:"35px",margin:"auto",marginRight:"7px"}} alt='logo'/>
			<p style={{fontSize:"0.9rem",letterSpacing:"0.5px",margin:"auto"}}><b>Giha Follow</b></p>
			</div>
		</div>
		<div style={{display:"flex",justifyContent:"center",height:"20vh"}}  className='col-4'>
			<img onClick={()=>window.open(user.profileUrl,"_blank")} src={user.avatar} style={{height:"19vh",margin:"auto",borderRadius:"50%",border:"2px solid #ffffff"}} alt={user.username}/>
		</div>
		<div style={{margin:"auto",height:"20vh",display:"flex",alignItems:"center"}} className='col-5'>
			<div style={{display:"flex",padding:"5px",flexDirection:"column",border:"2px solid #ddd",width:"fit-content",
			height:"fit-content",boxSizing:"border-box",overflow:"hidden"}}>
				<h1 style={{fontSize:"1rem",margin:"0"}}>Name: {user.name}</h1>
				<h2 style={{marginTop:"0",fontSize:"0.8rem"}}>Username: {user.username}</h2>
				<p style={{fontSize:"0.8rem",
				margin:"0",
				overflowWrap:"anywhere", 
				overflow:"hidden"}}>Bio: {user.bio}</p>
			</div>
		</div>
	</div>
  )
}

export default DashBoardNavbar;