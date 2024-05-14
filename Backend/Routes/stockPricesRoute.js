

const express = require("express");
const https = require("https");
const router = express.Router();

router.get("/stock_prices", (req, res) => {
  try {
    const symbols = req.query.symbols || "AAPL";
    const apiUrl = `https://api.twelvedata.com/time_series?symbol=${symbols}&interval=1min&apikey=18f471daf9a44ff2befa4b5902906109`;

    https.get(apiUrl, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        const stockData = JSON.parse(data);
        res.json(stockData);
      });
    });
  } catch (error) {
    console.error("Error fetching stock prices:", error.message);
    res.status(500).json({ error: "Could not fetch stock prices" });
  }
});

module.exports = router;


//example api call  to twelve data
//    http://localhost:8000/api/stock_prices?symbols=AAPL,EUR/USD,ETH/BTC:Huobi,TRP:TSX