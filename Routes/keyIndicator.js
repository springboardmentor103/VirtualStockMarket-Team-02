const express = require("express");
const router = express.Router();
const { verifyauthtoken } = require("../Middleware/authtoken");
const Portfolio = require("../Models/Portfolio");
const axios = require("axios");

router.get("/key-indicators", verifyauthtoken, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.payload._id });
    if (!portfolio) {
      return res.status(404).json({ success: false, message: "Portfolio not found" });
    }
    
    const portfolioValue = await calculatePortfolioValue(portfolio);

    return res.status(200).json({
      success: true,
      portfolioValue,
      cashBalance: portfolio.cashBalance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

async function calculatePortfolioValue(portfolio) {
  let totalValue = 0;
  for (const holding of portfolio.holdings) {
    const { symbol, quantity } = holding;
    try {
      const price = await fetchRealTimePrice(symbol);
      const holdingValue = quantity * price;
      totalValue += holdingValue;
    } catch (error) {
      console.error(`Error fetching real-time price for symbol ${symbol}:`, error);
    }
  }
  return totalValue;
}

async function fetchRealTimePrice(symbol) {
  try {
    const response = await axios.get(`https://query1.finance.yahoo.com/v7/finance/quote?symbol=${symbol}`);
    const priceData = response.data;
    const price = priceData.quoteSummary.result[0].price.regularMarketPrice.raw;
    return price;
  } catch (error) {
    console.error(`Error fetching real-time price for symbol ${symbol}:`, error);
    throw error;
  }
}

module.exports = router;


/*const express = require("express");
const router = express.Router();
const { verifyauthtoken } = require("../Middleware/authtoken");
const Portfolio = require("../Models/Portfolio");
const axios = require("axios");

// Get key indicators such as portfolio value and cash balance
router.get("/key-indicators", verifyauthtoken, async (req, res) => {
  try {
    // Fetch portfolio data based on user ID
    const portfolio = await Portfolio.findOne({ userId: req.payload._id });
    if (!portfolio) {
      return res.status(404).json({ success: false, message: "Portfolio not found" });
    }
    
    // Calculate portfolio value based on holdings
    const portfolioValue = await calculatePortfolioValue(portfolio);

    return res.status(200).json({
      success: true,
      portfolioValue,
      cashBalance: portfolio.cashBalance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Function to calculate portfolio value
async function calculatePortfolioValue(portfolio) {
  let totalValue = 0;
  for (const holding of portfolio.holdings) {
    const { symbol, quantity } = holding;
    try {
      // Fetch real-time price for each symbol from Yahoo Finance API
      const price = await fetchRealTimePrice(symbol);
      // Calculate total value for the current holding
      const holdingValue = quantity * price;
      // Accumulate totalValue
      totalValue += holdingValue;
    } catch (error) {
      console.error(`Error fetching real-time price for symbol ${symbol}:`, error);
      // Handle errors by continuing with the next holding or rethrowing the error
      // For now, we continue with the next holding
    }
  }
  return totalValue;
}

// Function to fetch real-time price for a given symbol from Yahoo Finance API
async function fetchRealTimePrice(symbol) {
  try {
    // Fetch real-time prices from Yahoo Finance API
    const response = await axios.get(`https://query1.finance.yahoo.com/v7/finance/quote?symbol=${symbol}`);
    const priceData = response.data;
    // Extract the price from the response data
    const price = priceData.quoteSummary.result[0].price.regularMarketPrice.raw;
    return price;
  } catch (error) {
    // Handle errors appropriately, such as returning a default price or rethrowing the error
    console.error(`Error fetching real-time price for symbol ${symbol}:`, error);
    throw error;
  }
}

module.exports = router;
*/