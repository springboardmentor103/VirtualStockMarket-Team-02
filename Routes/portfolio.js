const express = require("express");
const router = express.Router();
const Portfolio = require("../Models/Portfolio");
const { verifyauthtoken } = require("../Middleware/authtoken");
const fetch = require("node-fetch");
async function convertToUSD(amountInCrypto) {
  try {
      const apiKey = 'dj0yJmk9UFh1UUc0UlVmdHhKJmQ9WVdrOVpsSkpWMkpPTjNJbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTJi';
      const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbol=BTC-USD&apikey=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data || !data.quoteSummary || !data.quoteSummary.result || !data.quoteSummary.result[0] || !data.quoteSummary.result[0].price || !data.quoteSummary.result[0].price.regularMarketPrice || !data.quoteSummary.result[0].price.regularMarketPrice.raw) {
          throw new Error("Invalid response format");
      }

      const btcToUsdPrice = data.quoteSummary.result[0].price.regularMarketPrice.raw;

      const amountInUSD = amountInCrypto * btcToUsdPrice;

      return amountInUSD;
  } catch (error) {
      console.error("Error converting cryptocurrency to USD:", error);
      return null;
  }
}

router.post("/buy-stock", verifyauthtoken, async (req, res) => {
    try {
        const userId = req.payload._id;
        const { symbol, quantity } = req.body;

        let portfolio = await checkUserPortfolio(userId);
        if (!portfolio) {
            portfolio = new Portfolio({ userId });
        }

        const cryptoBalance = portfolio.cashBalance;
        const purchaseAmount = await convertToUSD(quantity);

        if (cryptoBalance < purchaseAmount) {
            return res.status(400).json({ success: false, message: "Insufficient funds" });
        }

        portfolio.cashBalance -= purchaseAmount;

        portfolio.holdings.push({ symbol, quantity });

        await portfolio.save();

        return res.status(200).json({ success: true, message: "Stock bought successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

router.post("/sell-stock", verifyauthtoken, async (req, res) => {
    try {
        const userId = req.payload._id;
        const { symbol, quantity } = req.body;

        let portfolio = await checkUserPortfolio(userId);
        if (!portfolio) {
            return res.status(400).json({ success: false, message: "User does not have a portfolio" });
        }

        let cryptoBalance = portfolio.cashBalance;

        const saleAmount = await convertToUSD(quantity);

        portfolio.cashBalance += saleAmount;

        await portfolio.save();

        return res.status(200).json({ success: true, message: "Stock sold successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

router.get("/portfolio", verifyauthtoken, async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ userId: req.payload._id });
        if (!portfolio) {
            return res.status(404).json({ success: false, message: "Portfolio not found" });
        }
        return res.status(200).json({ success: true, portfolio });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

async function checkUserPortfolio(userId) {
    try {
        return await Portfolio.findOne({ userId });
    } catch (error) {
        console.error("Error checking user's portfolio:", error);
        return null;
    }
}

module.exports = router;


/*const express = require("express");
const router = express.Router();
const Portfolio = require("../Models/Portfolio");
const { verifyauthtoken } = require("../Middleware/authtoken");
const fetch = require("node-fetch");
async function convertToUSD(amountInCrypto) {
  try {

      const apiKey = 'dj0yJmk9UFh1UUc0UlVmdHhKJmQ9WVdrOVpsSkpWMkpPTjNJbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTJi';
      const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbol=BTC-USD&apikey=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      console.log("Response from Yahoo Finance API:", data); // Log the response

      // Check if the response contains the expected structure
      if (!data || !data.quoteSummary || !data.quoteSummary.result || !data.quoteSummary.result[0] || !data.quoteSummary.result[0].price || !data.quoteSummary.result[0].price.regularMarketPrice || !data.quoteSummary.result[0].price.regularMarketPrice.raw) {
          throw new Error("Invalid response format");
      }

      // Extract the current price of Bitcoin (BTC) from the API response
      const btcToUsdPrice = data.quoteSummary.result[0].price.regularMarketPrice.raw;

      // Calculate the equivalent amount in USD
      const amountInUSD = amountInCrypto * btcToUsdPrice;

      return amountInUSD;
  } catch (error) {
      console.error("Error converting cryptocurrency to USD:", error);
      return null;
  }
}

// Buy stock endpoint
router.post("/buy-stock", verifyauthtoken, async (req, res) => {
    try {
        const userId = req.payload._id;
        const { symbol, quantity } = req.body;

        // Check if the user has a portfolio
        let portfolio = await checkUserPortfolio(userId);
        if (!portfolio) {
            // If the user doesn't have a portfolio, create one
            portfolio = new Portfolio({ userId });
        }

        // Simulate cash balance in cryptocurrency
        const cryptoBalance = portfolio.cashBalance;
        const purchaseAmount = await convertToUSD(quantity); // Convert to USD for stock purchase

        // Check if user has enough cash balance
        if (cryptoBalance < purchaseAmount) {
            return res.status(400).json({ success: false, message: "Insufficient funds" });
        }

        // Deduct purchase amount from crypto balance
        portfolio.cashBalance -= purchaseAmount;

        // Add purchased stocks to portfolio (mock implementation)
        portfolio.holdings.push({ symbol, quantity });

        // Save or update portfolio
        await portfolio.save();

        return res.status(200).json({ success: true, message: "Stock bought successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Sell stock endpoint
router.post("/sell-stock", verifyauthtoken, async (req, res) => {
    try {
        const userId = req.payload._id;
        const { symbol, quantity } = req.body;

        // Check if the user has a portfolio
        let portfolio = await checkUserPortfolio(userId);
        if (!portfolio) {
            return res.status(400).json({ success: false, message: "User does not have a portfolio" });
        }

        // Simulate cash balance in cryptocurrency
        let cryptoBalance = portfolio.cashBalance;

        // Calculate sale amount (mock implementation)
        const saleAmount = await convertToUSD(quantity); // Convert to USD for cash balance

        // Add sale amount to crypto balance
        portfolio.cashBalance += saleAmount;

        // Update quantity of sold stock in portfolio (mock implementation)
        // Here, you might want to remove the sold stocks from the portfolio holdings

        // Save or update portfolio
        await portfolio.save();

        return res.status(200).json({ success: true, message: "Stock sold successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Portfolio endpoint to fetch user's portfolio
router.get("/portfolio", verifyauthtoken, async (req, res) => {
    try {
        // Fetch portfolio data based on user ID
        const portfolio = await Portfolio.findOne({ userId: req.payload._id });
        if (!portfolio) {
            return res.status(404).json({ success: false, message: "Portfolio not found" });
        }
        return res.status(200).json({ success: true, portfolio });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Function to check if the user has a portfolio
async function checkUserPortfolio(userId) {
    try {
        return await Portfolio.findOne({ userId });
    } catch (error) {
        console.error("Error checking user's portfolio:", error);
        return null;
    }
}

module.exports = router;
*/