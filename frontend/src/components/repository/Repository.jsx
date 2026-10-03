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
	<div className="container">
		<input
			type="text"
			placeholder="search repo"
			value={query}
			onChange={(e)=>setQuery(e.target.value)}
		/>
		<button onClick={searchRepository}>search</button>
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