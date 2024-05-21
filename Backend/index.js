const mongodb = require("./db");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const cookieparser = require("cookie-parser");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 8000;
require('dotenv').config({ path: './process.env' });
const removeExpiredOTP = require("./Middleware/expireotps");

mongodb()
  .then(() => {
    removeExpiredOTP();
    app.use(
      cors({
        origin: "http://localhost:3000", 
        credentials: true, 
      })
    );
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieparser());
    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    // Routes
    app.use("/api", require("./Routes/APICoinMarket"));
    app.use("/api", require("./Routes/CreateUser"));
    app.use("/api", require("./Routes/LoginUser"));
    app.use("/api", require("./Routes/OtpGeneration"));
    app.use("/api", require("./Routes/OtpMatching"));
    app.use("/api", require("./Routes/NewPassword"));
    app.use("/api", require("./Routes/LogoutUser"));
    app.use("/api", require("./Routes/Dashboard"));
    app.use("/api", require("./Routes/Portfolio"));
    app.use("/api", require("./Routes/CryptoDetails"));
    app.use("/api", require("./Routes/stockRoutes"));
    app.use("/api", require("./Routes/TocheckToken")); 
    app.use("/api", require("./Routes/leaderboard"));
    app.use("/api", require("./Routes/loginAttempts"));
    app.listen(port, () => {
      console.log(`Virtual stock market Platform listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
