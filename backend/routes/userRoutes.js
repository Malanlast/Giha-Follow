const express=require("express");
const {getCurrentUser, getAllUsers,
	   followUser,unfollowUser,
	   isfollowing}=require("../controllers/userController.js");
const isAuthenticated=require("../middleware/authMiddleware.js");
const router=express.Router();

router.get("/me",isAuthenticated,getCurrentUser);
router.get("/",isAuthenticated,getAllUsers);
router.put("/:username/follow",isAuthenticated,followUser);
router.delete("/:username/unfollow",isAuthenticated,unfollowUser);
router.get("/:username/follow-status",isAuthenticated,isfollowing);
module.exports=router;