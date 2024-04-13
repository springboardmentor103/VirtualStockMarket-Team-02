const mongoose = require('mongoose');
const { Schema }=mongoose;
const userschema = new Schema({
    name: {
        type:String,
        required:true
    },
    username: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true,
    },
    password: {
        type:String,
        required:true
    },
    confirmpassword: {
        type:String,
        required:true
    },
    otp:{
        type:String,
        default:null
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
  });
  module.exports=mongoose.model('user',userschema);