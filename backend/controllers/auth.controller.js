const User=require("../models/user.model")
const {errorHanlder}=require("../utils/error")
exports.signup=async (req,res)=>{
const {username,email,password}=req.body;
const newuser=new User({username,email,password});
try{
await newuser.save();
res.status(201).json({"message":"user created sucessfully"});
}
catch(error){
  next(error);
}
};