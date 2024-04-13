const express=require("express");
const app=express();
const dotenv=require("dotenv");
const cors=require('cors');
const port=8008;
// const cookieParser=require("cookie-parser");
const {mongoose}=require("mongoose");
dotenv.config();
//mongoose connection
mongoose.connect(process.env.MONGO_URL).then(()=>
    console.log("Database connected")
)
.catch((err)=>console.log("database not connected",err));

//middleware
app.use(express.json());
// app.use(cookieParser)
app.use(express.urlencoded({extended:false}))
app.use('/',require("./routes/authRoutes"))

app.listen(port,()=>{console.log(`server is running on ${port}`)})
