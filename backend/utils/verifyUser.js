const jwt=require('jsonwebtoken');
const {errorHandler}=require("../utils/error")
exports.verifyUser=(req,res,next)=>{
    const token=req.cookies.access_token;
    if(!token)
    {
        return next(errorHandler(401,"unauthorized"));

    }
 jwt.verify(token,process.env.Jwt_Secret,(err,decoded)=>{
    if(err)
    {
        return next(errorHandler(401,"some error occured"));
    }
    req.user=decoded;
 });
 
  
   next();
}