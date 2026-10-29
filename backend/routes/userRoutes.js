const express=require("express");
const {getCurrentUser, getAllUsers,
	   followUser, unfollowUser,
	   isfollowing, getFollowRequest,
	   isMutualFollow,
	   getNewUsers,getFollowingUsers,getFollowersUsers}=require("../controllers/userController.js");
const isAuthenticated=require("../middleware/authMiddleware.js");
const router=express.Router();

router.get("/me",isAuthenticated,getCurrentUser);
router.get("/",isAuthenticated,getAllUsers);
router.put("/:username/follow",isAuthenticated,followUser);
router.delete("/:username/unfollow",isAuthenticated,unfollowUser);
router.get("/new-users", isAuthenticated, getNewUsers);
router.get("/following", isAuthenticated, getFollowingUsers);
router.get("/followers", isAuthenticated, getFollowersUsers);
router.get("/:username/follow-status",isAuthenticated,isfollowing);
router.get("/:username/mutual-follow", isAuthenticated, isMutualFollow);
router.get("/follow-requests",isAuthenticated,getFollowRequest);
module.exports=router;