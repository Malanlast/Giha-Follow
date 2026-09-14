const express=require("express");
const { githubCallback, } = require("../controllers/authControllers.js");

const router=express.Router();

router.get("/github",(req,res)=>{
	const clientId=process.env.GITHUB_CLIENT_ID;

	const redirectUrl=`https://github.com/login/oauth/authorize?client_id=${clientId}&scope=read:user,user:email,user:follow`;

	res.redirect(redirectUrl);
});

router.get("/github/callback",githubCallback);

module.exports=router;