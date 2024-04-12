const User=require("../models/user")
async function handleUserSignup(req,res){
    const {name,email,password}=req.body;
    await User.create({
        name,
        email,
        password,
    });
    // return something
    }
async function handleUserLogin(req,res){
    const {email,password}=req.body;
    const user = await User.findOne({email,password});
    if (!user) 
    {
        // return error for not getting correct user
    } 
        // return something
        }    
module.exports={
    handleUserSignup,
    handleUserLogin
}