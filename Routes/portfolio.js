const express = require("express");
const router = express.Router();
const Portfolio = require("../Models/Portfolio");
const { verifyauthtoken } = require("../Middleware/authtoken");
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
  
      // Log the cash balance before the conditional check
      console.log("Cash balance before purchase:", portfolio.cashBalance);
  
      // Fetch stock details from external API (not implemented here)
      const stockDetails = await fetchStockDetails(symbol);
  
      // Calculate purchase amount
      const purchaseAmount = stockDetails.price * quantity;
  
      // Check if user has enough cash balance
      if (portfolio.cashBalance < purchaseAmount) {
        return res.status(400).json({ success: false, message: "Insufficient funds" });
      }
  
      // Deduct purchase amount from cash balance
      portfolio.cashBalance -= purchaseAmount;
  
      // Add purchased stocks to portfolio
      const existingStock = portfolio.holdings.find(stock => stock.symbol === symbol);
      if (existingStock) {
        existingStock.quantity += quantity;
      } else {
        portfolio.holdings.push({ symbol, quantity });
      }
  
      // Save or update portfolio
      await portfolio.save();
  
      return res.status(200).json({ success: true, message: "Stock bought successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
  
/*// Buy stock endpoint
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

    // Fetch stock details from external API (not implemented here)
    const stockDetails = await fetchStockDetails(symbol);

    // Calculate purchase amount
    const purchaseAmount = stockDetails.price * quantity;

    // Check if user has enough cash balance
    if (portfolio.cashBalance < purchaseAmount) {
      return res.status(400).json({ success: false, message: "Insufficient funds" });
    }

    // Deduct purchase amount from cash balance
    portfolio.cashBalance -= purchaseAmount;

    // Add purchased stocks to portfolio
    const existingStock = portfolio.holdings.find(stock => stock.symbol === symbol);
    if (existingStock) {
      existingStock.quantity += quantity;
    } else {
      portfolio.holdings.push({ symbol, quantity });
    }

    // Save or update portfolio
    await portfolio.save();

    return res.status(200).json({ success: true, message: "Stock bought successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
*/
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

    // Fetch stock details from external API (not implemented here)
    const stockDetails = await fetchStockDetails(symbol);

    // Check if user owns enough quantity of the stock
    const existingStock = portfolio.holdings.find(stock => stock.symbol === symbol);
    if (!existingStock || existingStock.quantity < quantity) {
      return res.status(400).json({ success: false, message: "Insufficient stocks to sell" });
    }

    // Calculate sale amount
    const saleAmount = stockDetails.price * quantity;

    // Add sale amount to cash balance
    portfolio.cashBalance += saleAmount;

    // Update quantity of sold stock in portfolio
    existingStock.quantity -= quantity;

    // Remove stock from portfolio if quantity becomes zero
    if (existingStock.quantity === 0) {
      portfolio.holdings = portfolio.holdings.filter(stock => stock.symbol !== symbol);
    }

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

// Function to fetch stock details from external API (not implemented here)
async function fetchStockDetails(symbol) {
  // Mock implementation
  return { price: 100 }; // Replace with actual API call
}

module.exports = router;
