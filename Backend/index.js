const mongodb = require("./db");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const cookieparser = require("cookie-parser");
require("dotenv").config();
const app = express();
const port = process.env.PORT;
const removeExpiredOTP = require("./Middleware/expireotps");
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
    app.use("/api", require("./Routes/stockPricesRoute"));
    app.use("/api", require("./Routes/stockPricesRoute2"));


    app.listen(port, () => {
      console.log(`Virtual dtock market Platform listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
