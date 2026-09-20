const axios=require("axios");
const User=require("../models/User.js");

const githubCallback=async (req,res)=>{
	try{
		const {code}=req.query;

		if(!code){
			return res.status(400).json({
				message:"Authorization code not found",
			});
		}

		const tokenResponse=await axios.post(
			"https://github.com/login/oauth/access_token",
			{
				client_id:process.env.GITHUB_CLIENT_ID,
				client_secret:process.env.GITHUB_CLIENT_SECRET,
				code:code,
			},
			{
				headers:{
					Accept:"application/json",
				},
			}
		);

		const accessToken=tokenResponse.data.access_token;

		const githubUserResponse=await axios.get(
			"https://api.github.com/user",
			{
				headers:{
					Authorization:`Bearer ${accessToken}`,
					Accept:"application/vnd.github+json",
				},
			}
		);

		const githubUser=githubUserResponse.data;

		const user=await User.findOneAndUpdate(
			{githubId:githubUser.id.toString()},
			{
				githubId:githubUser.id.toString(),
				username:githubUser.login,
				name:githubUser.name || "",
				avatar:githubUser.avatar_url,
				bio:githubUser.bio || "",
				profileUrl:githubUser.html_url,
			},{
				new:true,
				upsert:true,
			}
		);

		req.session.userId=user._id.toString();

		req.session.githubAccessToken=accessToken;

		// res.json({
		// 	message:"Github authenticated successful",
		// 	accessToken,
		// });
		res.redirect("http://localhost:5173/dashboard");
	}catch(error){
		console.log(error.response?.data || error.message);

		res.status(500).json({
			message:"Github authentication failed",
		});
	}
};

const logout=(req,res)=>{
	req.session.destroy((error)=>{
		if(error){
			return res.status(500).json({
				message:"Failed to logout",
			});
		}
		res.clearCookie("connect.sid");
		res.status(200).json({
			message:"Logout successful",
		});
	});
};

module.exports={
	githubCallback,
	logout
}