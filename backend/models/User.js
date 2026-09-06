const mongoose=require("mongoose");

const userSchema=new mongoose.Schema(
	{
		githubId:{
			type:String,
			required:true,
			unique:true,
		},
		username:{
			type:String,
			required:true,
			unique:true,
		},
		name:{
			type:String,
			default:"",
		},
		avatar:{
			type:String,
			default:"",
		},
		bio:{
			type:String,
			default:"",
		},
		profileUrl:{
			type:String,
			default:"",
		},
	},
	{
		timestamps:true,
	}
);

const User=mongoose.model("User",userSchema);

module.exports=User;