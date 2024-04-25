const express=require ("express");
const router=express.Router();
const cors=require("cors");
const {test,registerUser,loginUser}=require("../controllers/authController")


//middleWare
// add as per hosting port
router.use(
    cors({
        credentials:true,
        origin:'http://localhost:5173'
    })
)

// router.get("/",(req,res)=>{

// })

router.get("/",test);
router.post("/register",registerUser);
router.post("/login",loginUser);
module.exports=router;