import './SearchRepo.css';
import { useState } from "react";
import axios from "axios";
function Repository() {
	const[query, setQuery]=useState("");
	const[repos, setRepos]=useState([]);
	const[loading, setLoading]=useState(false);
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
	<div className="searchBox" style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
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
			<div>
			<p>{repo.name}</p>
			<p>{repo.username}</p>
			<p>{repo.image}</p>
			<p>{repo.about}</p>
			<p>{repo.stars}</p>
			<p>{repo.forks}</p>
			<p>{repo.watchers}</p>
			<p>{repo.repositoryUrl}</p>
			<p>{new Date(repo.createdDate).toLocaleDateString()}</p>
			</div>
		))}
	</div>
  )
}

export default Repository;