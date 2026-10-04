import './SearchRepo.css';
import { useEffect, useState } from "react";
import axios from "axios";
function Repository() {
	const[query, setQuery]=useState("");
	const[repos, setRepos]=useState([]);
	const[loading, setLoading]=useState(false);
	useEffect(()=>{
		const modal=document.getElementById("exampleModal");
		const handleClose=()=>{
			setQuery("");
			setRepos([]);
		};
		modal?.addEventListener("hidden.bs.modal",handleClose);
		return()=>{
			modal?.removeEventListener("hidden.bs.modal",handleClose);
		}
	},[]);
	const searchRepository=async()=>{
		if(!query.trim()) return;
		try{
			setLoading(true);
			const response=await axios.get(
				`http://localhost:5000/api/repos/search?q=${encodeURIComponent(query)}`,
				{
					withCredentials:true
				}
			); 
			setRepos(response.data.repositories); 
		}catch(err){
			console.log(err.response?.data||err.message);
		}finally{
			setLoading(false);
		}
	}
  return (
	<div className="container-fluid" >
	<div className="searchBox" style={{display:"flex",justifyContent:"center",alignItems:"center",marginBottom:"1rem"}}>
			<input style={{width:"10rem",borderRadius:"5px",border:"1px solid #777777"}}
			type="text"
			placeholder="search repositories"
			value={query}
			onChange={(e)=>setQuery(e.target.value)}
			required
		/>  
			<button className='searchBtn' type="button" onClick={searchRepository}>
				<i className="bi bi-search"></i>
			</button> 
	</div>
		{loading && <p>searching...</p>}
		{repos.map((repo)=>(
			<div key={repo.repositoryUrl} className="card mb-3" style={{maxWidth:"500px"}}>
			<div className="row g-0">
				<div className="col-md-4">
				<img onClick={()=>window.open(repo.repositoryUrl,"_blank")}
				 src={repo.image} style={{cursor:"pointer"}}
				 className="img-fluid rounded-start" alt={repo.username}/>
				</div>
				<div className="col-md-8">
				<div className="card-body">
					<h5 className="card-title">{repo.name}</h5>
					<h6 className="card-subtitle mb-2 text-body-secondary">@{repo.username}</h6>
					<p ><i style={{color:"#f1d524"}} className="bi bi-star-fill"></i> {repo.stars}</p>
					<p className="card-text">{repo.about}</p> 
					<p className="card-text"><small className="text-body-secondary">
					{new Date(repo.createdDate).toLocaleDateString()}</small></p>
				</div>
				</div>
			</div>
			</div>
		))}
	</div>
  )
}

export default Repository;