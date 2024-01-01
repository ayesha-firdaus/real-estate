const User=require("../models/user.model")
const {errorHanlder}=require("../utils/error");
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken');

exports.signup=async (req,res,next)=>{
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
exports.signin=async(req,res,next)=>{
  const {email,password}=req.body;
  try{
const validUser=await User.findOne({email});

if(!validUser) return next(errorHanlder(404,'user not found'));
const validPassword=await validUser.validatePassword(password,validUser.password);
console.log(validPassword)


if(validPassword===false) return next(errorHanlder(401,"wrong credentials"));
const token=jwt.sign({id:validUser._id},process.env.Jwt_Secret);
const {password:pass,...rest}=validUser._doc;

res.cookie("access_token",token,{httpOnly:true}).status(200).json(rest);

  } 
  catch(error){
   next(error)
  }
}
exports.google=async(req,res,next)=>{
  try{
  const user=await User.findOne({email:req.body.email})

  if(user){
   const token=jwt.sign({id:user._id},process.env.Jwt_Secret);
   const {password:pass,...rest}=user._doc;
   res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
  }
  else{
   const generatedPassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8);
   const hashedPassword=bcryptjs.hashSync(generatedPassword,10);
   const newUser=new User({username:req.body.name.split(' ').join("").toLowerCase()+Math.random().toString(36).slice(-4),email:req.body.email,password:hashedPassword,avatar:req.body.photo});
   await newUser.save();
   const token=jwt.sign({id:newUser._id},process.env.Jwt_Secret);
   const {password:pass,...rest}=newUser._doc;
   res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);


  }
  }
  catch(error){
    console.log(error)
    next(error)
  }
}