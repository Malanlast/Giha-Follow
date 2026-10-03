const axios=require("axios");
const searchRepositories=async(req,res)=>{
	try{
		const {q}=req.query;
		const accessToken=req.session.githubAccessToken;
		if(!accessToken){
			return res.status(401).json({
				message:"Github Authentication required",
			});
		}
		if(!q){
			return res.status(400).json({
				message:"Search query is required",
			});
		}
		const twoYearsAgo=new Date();
		twoYearsAgo.setFullYear(twoYearsAgo.getFullYear()-2);
		const createdAfter=twoYearsAgo.toISOString().split("T")[0];
		const response=await axios.get(
			`https://api.github.com/search/repositories?q=${encodeURIComponent(q)}+created:>${createdAfter}&sort=updated&order=desc&per_page=50`,
			{
				headers:{
					Authorization:`Bearer ${accessToken}`,
					Accept:"application/vnd.github+json",
				},
			}
		);
		const repositories=response.data.items
		.filter((repo)=>{
			const hasDescription=repo.description;
			const hasProfileImg=repo.owner?.avatar_url;
			return(
				hasDescription&&hasProfileImg
			);
		}).map((repo)=>{
			const trendingScore=repo.stargazers_count+repo.fork_count+repo.watchers_count;
			return{
			name:repo.name,
			username:repo.owner.login,
			image:repo.avatar_url,
			about:repo.description,
			createdDate:repo.created_at,
			stars:repo.stargazers_count,
			watchers:repo.watchers_count,
			forks:repo.forks_count,
			repositoryUrl:repo.html_url,
			trendingScore,
			};
		}).sort((a,b)=>b.trendingScore-a.trendingScore).slice(0,10);
	}catch(err){
		console.log(err.response?.data||err.message);
		res.status(500).json({
			message:"Failed to search repositories",
		});
	}
};
module.exports={
	searchRepositories,
}