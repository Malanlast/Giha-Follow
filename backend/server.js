const express=require('express');
const connectDB=require("./config/db.js");
const app=express();
require("dotenv").config();
const PORT=process.env.PORT || 7000;

connectDB();
app.get("/",(req,res)=>{
	res.send("backend running on port 7000");
})

app.listen(PORT,(req,res)=>{
	console.log(`backend running on ${PORT}`);
});