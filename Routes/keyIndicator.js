const express = require("express");
const router = express.Router();
const { verifyauthtoken } = require("../Middleware/authtoken");
const Portfolio = require("../Models/Portfolio");

//const keyIndicatorsRoute = require("./keyIndicator");
// Get key indicators such as portfolio value and cash balance
router.get("/key-indicators", verifyauthtoken, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.payload._id });
    if (!portfolio) {
      return res.status(404).json({ success: false, message: "Portfolio not found" });
    }
    const portfolioValue = calculatePortfolioValue(portfolio);
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

function calculatePortfolioValue(portfolio) {
  // Calculate portfolio value based on holdings
  // Implement your logic here
}

module.exports = router;


/*// routes/keyIndicators.js
const express = require("express");
const router = express.Router();
const { verifyauthtoken } = require("../Middleware/authtoken");
const Portfolio = require("../Models/Portfolio");

// Get key indicators such as portfolio value and cash balance
router.get("/key-indicators", verifyauthtoken, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.payload._id });
    if (!portfolio) {
      return res.status(404).json({ success: false, message: "Portfolio not found" });
    }
    const portfolioValue = calculatePortfolioValue(portfolio);
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

function calculatePortfolioValue(portfolio) {
  // Calculate portfolio value based on holdings
  // Implement your logic here
}

module.exports = router;
*/