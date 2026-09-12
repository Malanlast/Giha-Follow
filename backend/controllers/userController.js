const User=require("../models/User.js");
const axios=require("axios");
const getCurrentUser=async(req,res)=>{
	try{
		const user=await User.findById(req.session.userId);

		if(!user){
			return res.status(404).json({
				message:"User not found",
			});
		}

		res.json({
			user,
		});
	}catch(error){
		res.status.json({
			message:"Server error",
		});
	}
};

const getAllUsers=async (req,res)=>{
	try{
		const users=await User.find().sort({createdAt:-1});

		res.status(200).json({
			count:users.length,
			users,
		});
	}catch(error){
		res.status(500).json({
			message:"Failed to fetch users",
		});
	}
};

const followUser=async(req,res)=>{
	try{
		const {username}=req.params;
		const accessToken=req.session.githubAccessToken;
		if(!accessToken){
			return res.status(401).json({
				message:"GitHub authenticated required",
			});
		}
        await axios.put(`https://api.github.com/user/following/${username}`,
			{},
			{
				headers:{
					Authorization:`Bearer ${accessToken}`,
					Accept:"application/vnd.github+json",
				},
			}
		);
		res.status(200).json({
			message:`Successfully followed ${username} on GitHub`,
		});
	}catch(error){
		console.log(error.response?.data || error.message);
		res.status(500).json({
			message:"Failed to follow user",
		});
	}
};

const unfollowUser=async(req,res)=>{
	try{
		const {username}=req.params;
		const accessToken=req.session.githubAccessToken;
		if(!accessToken){
			return res.status(401).json({
				message:"GitHub authentication required",
			});
		}
		await axios.delete(`https://api.github.com/user/following/${username}`,
			{
				headers:{
					Authorization:`Bearer ${accessToken}`,
					Accept:"application/vnd.github+json",
				},
			}
		);
		res.status(200).json({
			message:`Successfully unfollowed ${username} on GitHub`,
		});
	}catch(error){
		console.log(error.response?.data || error.message);
		res.status(500).json({
			message:"Failed to unfollow user",
		});
	}
};

module.exports={
	getCurrentUser,
	getAllUsers,
	followUser,
	unfollowUser,
};