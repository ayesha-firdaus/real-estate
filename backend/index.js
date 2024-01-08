const express=require("express");
const mongoose=require("mongoose")
const cookieParser=require('cookie-parser')
const dotenv=require("dotenv");
const userRouter=require("../backend/routes/user.routes")
const authRouter=require('../backend/routes/auth.routes');
const listingRouter=require("../backend/routes/listing.routes.js");
const bodyParser=require("body-parser");

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Connected to MongoDb!");
}).catch((err)=>{
 console.log(err);
})
const app=express();
app.use(express.json());
app.use(cookieParser());
const cors = require('cors');
app.use(cors());
app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({
  limit: '50mb', 
  extended: true, 
  parameterLimit: 50000
}));
app.use('/api/user',userRouter);
app.use("/api/auth",authRouter);
app.use("/api/listing",listingRouter);

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||'internal Server Error';
    return res.status(statusCode).json({
        status:"failed",
        statusCode,
        message,
    })
})
