const express=require('express');
const app=express();

app.get("/",(req,res)=>{
	res.send("backend running on port 7000");
})

app.listen(7000,(req,res)=>{
	console.log("backend running on 7000");
});