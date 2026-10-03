import { useState } from "react";
import './Navbar.css';
import Cards from "../cards/Cards";
function Navbar() {
	const[activeList,setActiveList]=useState("new");
  return (
	<>
	<nav className="navbar bg-body-tertiary" style={{marginTop:"1rem",height:"4rem"
	,minHeight:"4rem",maxHeight:"4rem"}}>
	<form className="container-fluid justify-content-start">
		<button onClick={()=>setActiveList("new")}
		className={`btn userListBtn me-2 ${activeList==="new"?"":"btn-sm"}`}
		style={{backgroundColor:activeList==="new"?"#202020":"",
		        color:activeList==="new"?"white":""}}
		type="button">New Users</button>
		<button
		onClick={()=>setActiveList("following")}
		style={{backgroundColor:activeList==="following"?"#202020":"",
		        color:activeList==="following"?"white":""}}
		 className={`btn userListBtn ${activeList==="following"?"":"btn-sm"}`}
		 type="button">Followings</button>
		 <button
			onClick={()=>setActiveList("searchRepo")}
			style={{marginLeft:"10px",backgroundColor:activeList==="searchRepo"?"#202020":"",
		        color:activeList==="searchRepo"?"white":""}}
				className={`btn userListBtn ${activeList==="searchRepo"?"":"btn-sm"}`}
				type="button"
		 >
		 search Repo
		 </button>
	</form>
	</nav>
	<Cards
		activeList={activeList}
	/>
	</>
  )
};

export default Navbar;