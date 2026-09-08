const express=require("express");

const {getCurrentUser}=require("../controllers/userController.js");

const isAuthenticated=require("../middleware/authMiddleware.js");

const router=express.Router();

router.get("/me",isAuthenticated,getCurrentUser);

module.exports=router;