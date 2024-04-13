const User = require("../models/user")
const {hashPassword,comparePassword} =require("../helpers/auth");
const jwt = require("jsonwebtoken");


const test=(req,res)=>{
    res.json("test")
}

const registerUser=async (req,res)=>{
    try {
        const{name , email,password }=req.body;
        //checks
        if(!name || name.length<6){
            return res.json({
                error:"Name is required"    
            })
        };
        if (!password || password.length<6){
            return res.json({
                error:"Password is wrong"
            })
        }
        
        //check if email is unique
        const exist= await User.findOne({email})
        if (exist){
            return res.json({
                error:"email is repeated"
            })
        }
//hashing the password
        const hashedPassword= await hashPassword(password)


        const user = await User.create({
            name,email,password:hashedPassword,
        })

        return res.json(user)
    } catch (error) {
        console.log(error)
    }
}

//login endpoint
const loginUser= async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if (!user){
            return res.json({
                error:"User is not registered"
            })
        }

//check if passwords match
        const match=await comparePassword(password,user.password)
        if (match ){
//assign jwt
            // res.json("passwords match")
        jwt.sign({email:user.email,id:user._id,name:user.name},process.env.JWT_SECRET, {} ,(err,token)=>{
            if (err){throw err};
            res.cookie('token',token).json(user)
        })

        }
        if(!match){
            res.json({error:"passwords dont match"})
        }

    } catch (error) {
        console.log("error=>",error)
    }
}

module.exports={
    test,
    registerUser,
    loginUser
}