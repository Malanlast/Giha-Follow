import { useState } from "react";
import './Navbar.css';
import Cards from "../cards/Cards";
import RepoDialogBox from "../repository/RepoDialogBox";
function Navbar() {
	const[activeList,setActiveList]=useState("new");
	const[isFollowRequest, setIsFollowRequest]=useState([]);
	const[newUserNotification,setNewUserNotification]=useState([]);
  return (
	<>
	<nav className="navbar bg-body-tertiary" style={{marginTop:"1rem",height:"4rem"
	,minHeight:"4rem",maxHeight:"4rem"}}>
	<form className="container-fluid justify-content-start">
		<button onClick={()=>setActiveList("new")}
		className={`btn userListBtn me-2 ${activeList==="new"?"":"btn-sm"}`}
		style={{backgroundColor:activeList==="new"?"#202020":"",
		        color:activeList==="new"?"white":""}}
		type="button">
		New Users 
		{
			newUserNotification.length>0&&(
				<span className="requestCount">
				{newUserNotification.length}
				</span>
			)
		}
		</button>
		<button
		onClick={()=>setActiveList("following")}
		style={{backgroundColor:activeList==="following"?"#202020":"",
		        color:activeList==="following"?"white":""}}
		 className={`btn userListBtn me-2 ${activeList==="following"?"":"btn-sm"}`}
		 type="button">Followings</button>
		 <button
		onClick={()=>setActiveList("follow-requests")}
		style={{backgroundColor:activeList==="follow-requests"?"#202020":"",
		        color:activeList==="follow-requests"?"white":""}}
		 className={`btn userListBtn ${activeList==="follow-requests"?"":"btn-sm"}`}
		 type="button">Requests
			{
				isFollowRequest.length>0&&(
					<span className="requestCount">{isFollowRequest.length}</span>
				)
			}
		 </button>
		 <RepoDialogBox/>
	</form>
	</nav>
	<Cards
		activeList={activeList}
		isFollowRequest={isFollowRequest}
		setIsFollowRequest={setIsFollowRequest} 
		setNewUserNotification={setNewUserNotification}
	/>
	</>
  )
};

export default Navbar;