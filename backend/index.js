const express=require("express");
const mongoose=require("mongoose")
const dotenv=require("dotenv");
const userRouter=require("../backend/routes/user.routes")
dotenv.config();
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Connected to MongoDb!");
}).catch((err)=>{
 console.log(err);
})
const app=express();
app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})
app.use('/api/user',userRouter);
