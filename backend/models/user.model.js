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
    },
    avatar:{
        type:String,
        default:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAngMBIgACEQEDEQH/xAAbAAEAAwEBAQEAAAAAAAAAAAAAAQMEBQIHBv/EAC8QAQACAQIEBAMIAwAAAAAAAAABAgMRIQQSMVEFQWGRInGBExQyM1JTYnJCodH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/APuIAAAAAAAAI1BIjVIAAAAAAAAAAAAAiZiOqnJl8qzt3Bbe9a9ZVWzTO0bKQHqb2nrMoQIJ1eovaPN4AXVzeVo+sLq2i0bTqxpiZidYnSVGwVY8vNtbaVoAAAAAAAKs9+WukdZB4y5NZ0hWgQARa0VjW06QCRz8/G3tMxi+Gvfzllm1rb2mZn1kHbQ41Ml6TrS81n0buG4znmK5tImelo8wawAGjDfX4Z6wzpiZidY6g2DzS0XrEw9KAAAADLktzWmWjJOlJZQQAgMHiOWZtGKs7RvLe5HETrnyf2kFYCoAA6fA5ftMOkzram0tDn+GzpmtHlNXRRUAAtwW307tDHWdLRLZCgAAACrPOlPnLO0cR+GPmzoAADl8ZTk4i3ad3UUcXg+2prE/HHT19AcsTaJrOkxpMIVAHvFjtmvy0+s9gavDKTre8x6N7xixxixxSvSHpFAAS1U3pHyZWrH+CvyUegAAAV5o1pLM2WjWswyTtKCAAB5yZK468150hkycf+1TbvYGnNgx5t71+LvHVmt4fH+OSfrVV9+y+UU9j79m/h7KLqcBWJ1vebekRo146Vx15aViIc779m/h7Ecdl7U9gdIZMXH0ttkrNZ7+TXExMax0QAAS112iGbHHNeOzUoAAAAM2avLbXu0vN6xeukgyIyXjHSbW6Q9WiY116sHiV96446fikGbNltlvNrfSOysBAAAABo4TiJxX5bb0n/TOA7fkKOCvz8PGvWuzVjpNrafUVbgrpHN3WojpskAAAAAAFeTHz/NxPENuKmJ6xEO+o4nhcfE10vGkx0tHWAfnhp4ngc2DfTnr+qrMIAAAABETM6REzLfw3huTJpbN8Fe3nP8AwV68KrN65Ij9Tq1rFY0hGLHTFSK46xWseUPYAAAAAAAAAADPm4Lh8u9scRPeuzQA5l/Caz+XlmP7RqqnwnJ+7X2dgByI8Jv55a+y7H4Vij8y9rfLaHRAVYeHw4Y0x4619fNaAAAAAAAAAAAAAAAAAAAAAAAAAAAP/9k="
    },
   
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