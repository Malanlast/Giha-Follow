const User=require("../models/User.js");

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

module.exports={
	getCurrentUser,
	getAllUsers,
};