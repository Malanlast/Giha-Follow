import { useState } from "react";
import './Navbar.css';
function Navbar() {
	const[followList, setFollowList]=useState(true);
	const[followingList, setFollowingList]=useState(false); 
  return (
	<nav className="navbar bg-body-tertiary" style={{marginTop:"1rem",height:"4rem"}}>
	<form className="container-fluid justify-content-start">
		<button onClick={()=>{
			setFollowList(true);
			setFollowingList(false);
		}}
		className={`btn userListBtn me-2 ${followList?"":"btn-sm"}`}
		style={{backgroundColor:followList?"#202020":"",
		        color:followList?"white":""}}
		type="button">New Users</button>
		<button
		onClick={()=>{
			setFollowList(false);
			setFollowingList(true);
			}}
		style={{backgroundColor:followingList?"#202020":"",
		        color:followingList?"white":""}}
		 className={`btn userListBtn ${followingList?"":"btn-sm"}`}
		 type="button">Followings</button>
	</form>
	</nav>
  )
}

export default Navbar;