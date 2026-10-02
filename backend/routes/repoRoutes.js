const express=require("express");
const {searchRepositories}=require("../controllers/repoController.js");
const isAuthenticated=require("../middleware/authMiddleware.js");
const router=express.Router();
router.get("/search".isAuthenticated,searchRepositories);
module.exports=router;
