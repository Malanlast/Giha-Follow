const express=require("express");

const {getCurrentUser, getAllUsers}=require("../controllers/userController.js");

const isAuthenticated=require("../middleware/authMiddleware.js");

const router=express.Router();

router.get("/me",isAuthenticated,getCurrentUser);
router.get("/",isAuthenticated,getAllUsers);

module.exports=router;