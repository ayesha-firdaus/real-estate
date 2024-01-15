const express=require("express");
const {createListing,deletelist,updatelist,getlist}=require("../controllers/listing.controller.js");
const {verifyUser}=require("../utils/verifyUser");
const router=express.Router();
router.post('/create',verifyUser,createListing);
router.delete('/delete/:id',verifyUser,deletelist)
router.patch("/update/:id",verifyUser,updatelist);

router.get('/get/:id',getlist)
// router.delete('/delete/:id',verifyUser,deleteListing);
module.exports=router;