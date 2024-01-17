const User = require("../models/user.model");
const {errorHanlder} = require("../utils/error")
const jwt=require('jsonwebtoken');
const bcryptjs=require("bcryptjs");
const Listing=require("../models/listing.model");
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
    return next(errorHanlder(401,"you can only delete your own account"))
    try{
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json("user been deleted")
    }catch(error)
    {
        next(error);
    }

}
exports.getUserListing=(async(req,res,next)=>{
if(req.user.id === req.params.id)
{
    try{
const listing=await Listing.find({userRef:req.params.id});
res.status(200).json(listing);
}
catch(error)
{
    next(error);
}
}else{
    return next(errorHanlder(401,"you can only view your own listings"));
}

})

exports.getUser=async (req,res,next)=>{
    try{
        const user=await User.findById(req.params.id);
    if(!user)
    {
        return next(errorHanlder(404,'User not found'));
    }
    const {password:pass,...rest}=user._doc;
    res.status(200).json(rest);
    }
    catch(err)
    {
        next(err);
    }
}