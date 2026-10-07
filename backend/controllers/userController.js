const User=require("../models/User.js");
const axios=require("axios");
const {getIO}=require("../socket.js");
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
		const io=getIO();
		const follower=await User.findById(req.session.userId); 
		io.emit("followRequest",{
			targetUsername:username,
			follower:follower
		});
		io.emit("followBack", {
			targetUsername: follower.username,
			followedBackUser: username
		});
		res.status(200).json({
			message:`Successfully followed ${username} on GitHub`,
		});
	}catch(error){
		const status=error.response?.status;
		if(status===401){
			return res.status(401).json({
				message:"GitHub token is invalid or expired",
			});
		}
		if(status===403){
			return res.status(403).json({
				message:"GitHub API rate limit exceeded or permission denied",
			});
		}
		if(status===404){
			return res.status(404).json({
				message:"GitHUb user not found",
			});
		}
		if(status===422){
			return res.status(422).json({
				message:"Invalid GitHub follow request",
			});
		}
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
		const io=getIO();
		const unfollower=await User.findById(req.session.userId);
		io.emit("unfollow",{
			targetUsername:username,
			unfollower:unfollower
		});
		res.status(200).json({
			message:`Successfully unfollowed ${username} on GitHub`,
		});
	}catch(error){
		const status=error.response?.status;
		if(status===401){
			return res.status(401).json({
				message:"GitHub token is invalid or expired",
			});
		}
		if(status===403){
			return res.status(403).json({
				message:"GitHub API rate limit exceeded or permission denied",
			});
		}
		if(status===404){
			return res.status(404).json({
				message:"GitHUb user is not being followed",
			});
		}
		if(status===422){
			return res.status(422).json({
				message:"Invalid GitHub follow request",
			});
		}
		console.log(error.response?.data || error.message);
		res.status(500).json({
			message:"Failed to unfollow user",
		});
	}
};

const isfollowing=async(req,res)=>{
	try{
	const {username}=req.params;
	const accessToken=req.session.githubAccessToken;
	const response=await axios.get(
		`https://api.github.com/user/following/${username}`,
		{
			headers:{
				Authorization:`Bearer ${accessToken}`,
				Accept:"application/vnd.github+json",
			},
		}
	);
	return res.status(200).json({
		isFollowing: response.status===204,
	});
}catch(error){
	const status=error.response?.status;
	if(status===401){
			return res.status(401).json({
				message:"GitHub token is invalid or expired",
			});
		}
		if(status===403){
			return res.status(403).json({
				message:"GitHub API rate limit exceeded or permission denied",
			});
		}
	if(status===404){
		return res.status(200).json({
			isFollowing:false,
		});
	}
	console.log(error.response?.data || error.message);
	return res.status(500).json({
		message:"Failed to check follow status",
	});
}
};

const getFollowRequest=async(req,res)=>{
	try{
		const accessToken=req.session.githubAccessToken;
		if(!accessToken){
			return res.status(401).json({
				message:"github authentication required",
			});
		}
		const connectedUsers=await User.find({
			_id:{$ne:req.session.userId},
		});
		const followerResponse=await axios.get(
			`https://api.github.com/user/followers?per_page=50`,
			{
				headers:{
					Authorization:`Bearer ${accessToken}`,
					Accept:"application/vnd.github+json",
				},
			}
		);
		const followingResponse=await axios.get(
			`https://api.github.com/user/following?per_page=50`,
			{
				headers:{
					Authorization:`Bearer ${accessToken}`,
					Accept:"application/vnd.github+json",
				},
			}
		);
		const followUsernames=new Set(
			followerResponse.data.map((user)=>user.login)
		);
		const followingUsernames=new Set(
			followingResponse.data.map((user)=>user.login)
		);
		const requests=connectedUsers.filter(
			(user)=>
			followUsernames.has(user.username)&&
			!followingUsernames.has(user.username)
		);
		res.status(200).json({
			count:requests.length,
			users:requests,
		});
	}catch(err){
		console.log(err.response?.data||err.message);
		return res.status(500).json({
			message:"failed to fetch follow requests",
		});
	}
};
const isMutualFollow = async (req, res) => {
    try {
        const { username } = req.params;
        const accessToken = req.session.githubAccessToken;

        if (!accessToken) {
            return res.status(401).json({
                message: "GitHub authentication required",
            });
        }

        // Current logged-in user
        const currentUser = await User.findById(req.session.userId);

        if (!currentUser) {
            return res.status(404).json({
                message: "Current user not found",
            });
        }

        // Check: current user -> target user
        const followingResponse = await axios.get(
            `https://api.github.com/user/following/${username}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: "application/vnd.github+json",
                },
            }
        );

        const currentUserFollowsTarget =
            followingResponse.status === 204;

        // Check: target user -> current user
        const reverseResponse = await axios.get(
            `https://api.github.com/users/${username}/following/${currentUser.username}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: "application/vnd.github+json",
                },
            }
        );

        const targetFollowsCurrentUser =
            reverseResponse.status === 204;

        const isMutual =
            currentUserFollowsTarget &&
            targetFollowsCurrentUser;

        return res.status(200).json({
            isMutualFollow: isMutual,
        });

    } catch (error) {
        const status = error.response?.status;

        if (status === 401) {
            return res.status(401).json({
                message: "GitHub token is invalid or expired",
            });
        }

        if (status === 403) {
            return res.status(403).json({
                message: "GitHub API rate limit exceeded or permission denied",
            });
        }

        // 404 means the target does not follow the current user
        // or target GitHub user does not exist.
        if (status === 404) {
            return res.status(200).json({
                isMutualFollow: false,
            });
        }
        console.log(
            error.response?.data || error.message
        );

        return res.status(500).json({
            message: "Failed to check mutual follow status",
        });
    }
};

module.exports={
	getCurrentUser,
	getAllUsers,
	followUser,
	unfollowUser,
	isfollowing,
	getFollowRequest,
	isMutualFollow,
};