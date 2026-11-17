const express=require("express");
const { githubCallback,logout } = require("../controllers/authControllers.js");

const router=express.Router();

router.get("/github", (req, res) => {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_CALLBACK_URL;

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: "read:user user:email user:follow",
    });

    res.redirect(
        `https://github.com/login/oauth/authorize?${params.toString()}`
    );
});

router.get("/github/callback",githubCallback);
router.post("/logout",logout);
module.exports=router;