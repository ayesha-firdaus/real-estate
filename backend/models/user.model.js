const mongoose=require("mongoose");
const bcryptjs=require("bcryptjs");
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    }
   
},{
    timestamps:true
});
userSchema.pre('save',async function(next){
    if(!this.isModified('password'))
    {
        return next() ;
    }
  this.password=await bcryptjs.hash(this.password,12);
  next();
})
userSchema.methods.validatePassword=async function(candidatePassword,userPassword){
    return await bcryptjs.compare(candidatePassword,userPassword);
}
const User=mongoose.model("User",userSchema);
module.exports=User;