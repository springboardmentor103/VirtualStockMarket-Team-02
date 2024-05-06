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

// Import route files
const portfolioRoute = require("./Routes/portfolio");
const keyIndicatorsRoute = require("./Routes/keyIndicator");
const stockTickerRoute = require("./Routes/stockTicker");
const stockPriceRouter = require("./Routes/stockPriceRoute");
const { getCryptoPrice } = require("./Routes/stockCryptoRoute"); // Import only getCryptoPrice function

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

    // Routes
    app.use("/api", require("./Routes/CreateUser"));
    app.use("/api", require("./Routes/LoginUser"));
    app.use("/api", require("./Routes/OtpGeneration"));
    app.use("/api", require("./Routes/OtpMatching"));
    app.use("/api", require("./Routes/NewPassword"));
    app.use("/api", require("./Routes/LogoutUser"));

    // Use routes
    app.use("/api", portfolioRoute);
    app.use("/api", keyIndicatorsRoute);
    app.use("/api", stockTickerRoute);
    app.use("/api", stockPriceRouter);

    // Route for getting crypto price
    app.get("/api/stock_crypto_price", async (req, res) => {
      const symbol = req.query.symbol;

      if (!symbol) {
        return res.status(400).json({ error: 'Symbol parameter is missing' });
      }

      try {
        const price = await getCryptoPrice(symbol);
        res.json({ price });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.listen(port, () => {
      console.log(`Virtual stock market Platform listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });


/*const mongodb = require("./db");
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
const stockPriceRouter = require("./Routes/stockPriceRoute");
const stockCryptoRouter = require("./Routes/stockCryptoRoute");

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
    app.use("/api", stockPriceRouter);
    app.use("/api", stockCryptoRouter);
 
    app.listen(port, () => {
      console.log(`Virtual stock market Platform listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
*/