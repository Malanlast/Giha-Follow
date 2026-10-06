const http=require("http");
const {Server}=require("socket.io");
const {setIO}=require("./socket.js");

require("dotenv").config();
const express=require('express');
const session=require("express-session");
const {MongoStore}=require("connect-mongo");
const cors=require("cors");
const connectDB=require("./config/db.js");
const authRoutes=require("./routes/authRoutes.js");
const userRoutes=require("./routes/userRoutes.js");
const repoRoutes=require("./routes/repoRoutes.js");
const app=express();
const server=http.createServer(app);
const io=new Server(server,{
	cors:{
		origin:"http://localhost:5173",
		credentials:true,
	},
});
setIO(io);

const PORT=process.env.PORT || 5000;

connectDB();

app.use(express.json());

app.use(
	cors({
		origin:"http://localhost:5173",
		credentials:true,
	})
);

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
app.use("/api/users",userRoutes);
app.use("/api/repos",repoRoutes);
app.get("/",(req,res)=>{
	res.send("backend running on port 5000");
})

server.listen(PORT,()=>{
	console.log(`backend running on ${PORT}`);
});