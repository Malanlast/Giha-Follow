const express=require("express");

const {getCurrentUser, getAllUsers,followUser,unfollowUser}=require("../controllers/userController.js");

const isAuthenticated=require("../middleware/authMiddleware.js");

const router=express.Router();

router.get("/me",isAuthenticated,getCurrentUser);
router.get("/",isAuthenticated,getAllUsers);
router.put("/:username/follow",isAuthenticated,followUser);
router.delete("/:username/unfollow",isAuthenticated,unfollowUser);

module.exports=router;