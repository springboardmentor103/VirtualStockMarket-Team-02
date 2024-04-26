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
// Other imports...
const portfolioRoute = require("./Routes/portfolio");
const keyIndicatorsRoute = require("./Routes/keyIndicator");
const stockTickerRoute = require("./Routes/stockTicker");

mongodb()
  .then(() => {
    removeExpiredOTP();
    app.use(
      cors({
        origin: "*",
      })
    );
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieparser());
    app.get("/", (req, res) => {
      res.send("Hello World!");
    });
    app.use("/api", require("./Routes/CreateUser"));
    app.use("/api", require("./Routes/LoginUser"));
    app.use("/api", require("./Routes/OtpGeneration"));
    app.use("/api", require("./Routes/OtpMatching"));
    app.use("/api", require("./Routes/NewPassword"));
    app.use("/api", require("./Routes/LogoutUser"));
    app.use("/api", portfolioRoute); // New route for portfolio
    app.use("/api", keyIndicatorsRoute); // New route for key indicators
    app.use("/api", stockTickerRoute); // New route for stock ticker
 
    app.listen(port, () => {
      console.log(`Virtual stock market Platform listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
