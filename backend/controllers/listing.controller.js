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
exports.updatelist=async(req,res,next)=>{
    const listing=await Listing.findById(req.params.id);
    if(!listing)
    {
        return next(errorHanlder(404,"Listing not found"));
    }
    if(req.user.id!==listing.userRef){
        return next(errorHanlder(401,"you can only delete your own listing"));
    }
    try{
    const updatelisting=await Listing.findByIdAndUpdate(req.params.id,req.body,{new:true});
    res.status(200).json(updatelisting);
    }
    catch(err){
        next(err)
    }



}
exports.getlist=async(req,res,next)=>{
    try{
    const id=req.params.id;
    const list=await Listing.findById(id);
    if(!list)
    {
return next(errorHanlder(404,"Listing not found"));

    }
    res.status(200).json(list);
}
catch(err)
{
    next(err);
}
}
exports.getLists=async(req,res,next)=>{
    try{
      const limit=parseInt(req.query.limit)||9;
      const startIndex=parseInt(req.query.startIndex)||0;
      let offer=req.query.offer;
      if(offer === undefined || offer==='false')
      {
         offer={$in:[false,true]};
      }
      let furnished=req.query.furnished;
      if(furnished===undefined||furnished === 'false')
      {
        furnished={$in : [false,true]};
      }
     let parking=req.query.parking;
     if(parking === undefined || parking === 'false')
     {
        parking={$in :[false,true]};
     }
      let type=req.query.type;
      if(type=== undefined || type === "all")
      {
        type={$in:['sale','rent']};
      }
      const searchTerm=req.query.searchTerm || '';
      const sort = req.query.sort || 'createdAt';
      const order=req.query.order  || 'desc';
      const listings=await Listing.find({name:{$regex:searchTerm,$options:'i'},
    offer,
furnished,
parking,
type,
}).sort({[sort]:order}).limit(limit).skip(startIndex);
return res.status(200).json(listings);
    }
    catch(err)
    {
   next(err);
    }
}