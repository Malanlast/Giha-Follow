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
		return(<div className='row' style={{background:"red",height:"20vh"}} >
		<div style={{background:"pink",height:"5vh"}}  className='col-3'>
			<img src="" alt='logo'/>
		</div>
		<div style={{background:"gray"}}  className='col-4'>4</div>
		<div style={{background:"blue"}} className='col-5'>5</div>
	</div>)
	}
  return (
	<div className='row' style={{background:"red"}} >
		{/* <p>{user.username}</p>
		<p>{user.name}</p>
		<p>{user.profileUrl}</p>
		<img src={user.avatar} width={100} alt={user.username}/>
		<p>{user.bio}</p> */}
		<div style={{background:"pink"}}  className='col-3'>3</div>
		<div style={{background:"gray"}}  className='col-4'>4</div>
		<div className='col-5'>5</div>
	</div>
  )
}

export default DashBoardNavbar;