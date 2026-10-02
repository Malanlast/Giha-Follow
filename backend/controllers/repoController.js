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
		const response=await axios.get(
			`https://api.github.com/search/repositories?q=${encodeURIComponent(q)}`,
			{
				headers:{
					Authorization:`Bearer ${accessToken}`,
					Accept:"application/vnd.github+json",
				},
			}
		);
		const repositories=response.data.items.map((repo)=>({
			name:repo.name,
			username:repo.owner.login,
			image:repo.avatar_url,
			about:repo.description,
			createdDate:repo.created_at,
			stars:repo.stargazers_count,
			forks:repo.forks_count,
			repositoryUrl:repo.html_url,
		}));
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