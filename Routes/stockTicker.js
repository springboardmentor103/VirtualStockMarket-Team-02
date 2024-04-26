// routes/stockTicker.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

// Get real-time stock price ticker
router.get("/stock-ticker", async (req, res) => {
  try {
    // Fetch real-time stock data from Yahoo Finance API , need to  replace "https://api.example.com/real-time-stock-data" with the actual API endpoint for fetching real-time stock data.
    const response = await axios.get("https://api.example.com/real-time-stock-data");
    const stockData = response.data;
    return res.status(200).json({ success: true, stockData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch stock data" });
  }
});

module.exports = router;
