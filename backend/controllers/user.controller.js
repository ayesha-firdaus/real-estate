const User = require("../models/user.model");
const { errorHanlder } = require("../utils/error")
const jwt=require('jsonwebtoken');
const bcryptjs=require("bcryptjs");

exports.updateUser=async(req,res,next)=>{
  
    if(req.user.id!==req.params.id)return next(errorHanlder(401,"you can only update your own account"));
    try{
        if(req.body.password)
        {
            req.body.password=bcryptjs.hashSync(req.body.password,10);
        }
        const updateUser=await User.findByIdAndUpdate(req.params.id,{
            $set:{
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                avatar:req.body.avatar
            }
        },{new:true});
        const {password,...rest}=updateUser._doc;
        res.status(200).json(rest);
    }
    catch(error){
        next(error);
    }
}