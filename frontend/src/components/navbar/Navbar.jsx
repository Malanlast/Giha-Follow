import { useState } from "react";
import Messages from "../../Pages/Messages.jsx";
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
		onClick={() => setActiveList("followers")}
		style={{
			backgroundColor: activeList === "followers" ? "#202020" : "",
			color: activeList === "followers" ? "white" : ""
		}}
		className={`btn userListBtn me-2 ${
			activeList === "followers" ? "" : "btn-sm"
		}`}
		type="button"
		>
		Follow
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
		 <button
			onClick={() => setActiveList("messages")}
			className={`btn userListBtn me-2 ${
				activeList === "messages" ? "" : "btn-sm"
			}`}
			style={{
				backgroundColor: activeList === "messages" ? "#202020" : "",
				color: activeList === "messages" ? "white" : ""
			}}
			type="button"
		>
			<i className="bi bi-chat-dots me-1"></i>
			Messages
		</button>
	</form>
	</nav>
	{activeList === "messages" ? (
    <Messages />
		) : (
			<Cards
				activeList={activeList}
				isFollowRequest={isFollowRequest}
				setIsFollowRequest={setIsFollowRequest}
				setNewUserNotification={setNewUserNotification}
			/>
		)}
	</>
  )
};

export default Navbar;