const express=require("express");
const {updateUser,deleteUser,getUserListing,getUser}=require("../controllers/user.controller");
const {verifyUser}=require("../utils/verifyUser");

const router=express.Router();
router.post('/update/:id',verifyUser,updateUser);
router.delete('/delete/:id',verifyUser,deleteUser);
router.get('/listings/:id',verifyUser,getUserListing);
router.get('/:id',getUser);
module.exports=router;