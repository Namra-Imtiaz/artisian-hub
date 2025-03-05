const mongoose=require("mongoose")
const {Schema}=mongoose

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    isAdmin: { type: Boolean, default: false }, // New property
})

module.exports=mongoose.model("User",userSchema)