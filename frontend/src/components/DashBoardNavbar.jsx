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
	<div className='row' style={{background:"gray",height:"20vh"}} >
		<div style={{background:"pink",maxHeight:"6vh",marginTop:"1rem",display:"flex",justifyContent:"center"}}  className='col-3'>	
			<div style={{display:"flex",justifyContent:"center"}}>
			<img src="/GihaLogo.png" style={{height:"100%",margin:"auto",marginRight:"3px"}} alt='logo'/>
			<p style={{fontSize:"0.9rem",letterSpacing:"0.5px",margin:"auto",color:"white"}}><b>Giha Follow</b></p>
			</div>
		</div>
		<div style={{background:"green",display:"flex",justifyContent:"center"}}  className='col-4'>
			<img src={user.avatar} style={{height:"18vh",margin:"auto",borderRadius:"50%",border:"1px solid #232323"}} alt={user.username}/>
		</div>
		<div style={{background:"blue"}} className='col-5'>5</div>
	</div>
  )
}

export default DashBoardNavbar;