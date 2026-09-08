require("dotenv").config();
const express=require('express');
const session=require("express-session");
const {MongoStore}=require("connect-mongo");

const connectDB=require("./config/db.js");
const authRoutes=require("./routes/authRoutes.js");

const app=express();
const PORT=process.env.PORT || 5000;

connectDB();

app.use(express.json());

app.use(
	session({
		secret:process.env.SESSION_SECRET,
		resave:false,
		saveUninitialized:false,

		store:MongoStore.create({
			mongoUrl:process.env.MONGO_URL,
		}),

		cookie:{
			httpOnly:true,
			secure:false,
			maxAge:24*60*60*1000,
		},
	})
);

app.use("/api/auth",authRoutes);
app.get("/",(req,res)=>{
	res.send("backend running on port 5000");
})

app.listen(PORT,(req,res)=>{
	console.log(`backend running on ${PORT}`);
});