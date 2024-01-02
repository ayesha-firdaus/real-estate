const User = require("../models/user.model");
const {errorHanlder} = require("../utils/error")
const jwt=require('jsonwebtoken');
const bcryptjs=require("bcryptjs");

exports.updateUser=async(req,res,next)=>{
    try{

    if(req.user.id!==req.params.id)
    return next(errorHanlder(401,"you can only update your own account"));

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
exports.deleteUser=async(req,res,next)=>{
    if(req.user.id!==req.params.id)
    return next(errorHandler(401,"you can only delete your own account"))
    try{
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json("user bee deleted")
    }catch(error)
    {
        next(error);
    }

}