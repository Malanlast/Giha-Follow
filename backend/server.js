require("dotenv").config();
const express=require('express');
const connectDB=require("./config/db.js");
const authRoutes=require("./routes/authRoutes.js");

const app=express();
const PORT=process.env.PORT || 5000;

connectDB();

app.use("/api/auth",authRoutes);
app.get("/",(req,res)=>{
	res.send("backend running on port 5000");
})

app.listen(PORT,(req,res)=>{
	console.log(`backend running on ${PORT}`);
});