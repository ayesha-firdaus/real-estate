const Listing=require("../models/listing.model");
const {errorHanlder} = require("../utils/error")
exports.createListing=async(req,res,next)=>{
    try{
    const listing=await Listing.create(req.body);
    return res.status(201).json(listing);
    }
    catch(error){
        next(error);
    }
}
exports.deletelist=async(req,res,next)=>{
 
        const id=req.params.id;
       
        const listing=await Listing.findById(id);
         if(!listing)
         {
            return next(errorHanlder(404,"Listing not found"));
         }

      if(req.user.id!==listing.userRef){
        return next(errorHanlder(401,"you can only delete your own listing"))
      }
      try{
        const data=await Listing.findByIdAndDelete(req.params.id);

        res.status(200).json({message:"Lisitng has been deleted"});
    }
    catch(error){
        console.log(error);
        next(error);
    }
  
}