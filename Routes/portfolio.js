// portfolio.js
const express = require("express");
const router = express.Router();
const Portfolio = require("../Models/Portfolio");
const { verifyauthtoken } = require("../Middleware/authtoken");
const { getCryptoPrice } = require("./stockCryptoRoute");
const axios = require("axios");
//Route for buy 
router.post("/buy-stock", verifyauthtoken, async (req, res) => {
    try {
        const userId = req.payload._id;
        const { symbol, quantity } = req.body;

        // Retrieve the user's portfolio
        let portfolio = await checkUserPortfolio(userId);

        // If portfolio does not exist, create a new one with initial cash balance of $100
        if (!portfolio) {
            portfolio = new Portfolio({ userId, cashBalance: 10000 });
            console.log("New portfolio created. Initial Cash Balance:", portfolio.cashBalance);
            await portfolio.save(); // Save the new portfolio
        } else {
            console.log("Existing portfolio found. Cash balance:", portfolio.cashBalance);
        }

        // Fetch the purchase amount
        let purchaseAmount;
        try {
            // First, try to fetch cryptocurrency price
            purchaseAmount = await getCryptoPrice(symbol);
        } catch (cryptoError) {
            console.error("Error fetching cryptocurrency price:", cryptoError);
            // If fetching cryptocurrency price fails, try to fetch real-time stock price
            const apiUrl = `http://localhost:8000/api/stock_prices?symbols=${symbol}`;
            const response = await axios.get(apiUrl);
            const stockData = response.data;
            const stockPrice = stockData[symbol][0].open; // Assuming 'open' price is used
            if (isNaN(stockPrice) || stockPrice <= 0) {
                console.log("Invalid Stock Price:", stockPrice);
                return res.status(400).json({ success: false, message: "Invalid stock price" });
            }
            purchaseAmount = stockPrice;
        }

        // Ensure that purchaseAmount is a valid number
        if (isNaN(purchaseAmount) || purchaseAmount <= 0) {
            console.log("Invalid Purchase Amount:", purchaseAmount);
            return res.status(400).json({ success: false, message: "Invalid purchase amount" });
        }

        // Calculate total purchase cost
        const totalPurchaseCost = purchaseAmount * quantity;
        console.log("Purchase Amount:", purchaseAmount);
        console.log("Quantity:", quantity);
        console.log("Total Purchase Cost:", totalPurchaseCost);

        // Ensure that the user has sufficient funds
        if (portfolio.cashBalance < totalPurchaseCost) {
            console.log("Insufficient funds. Required:", totalPurchaseCost, "Available:", portfolio.cashBalance);
            return res.status(400).json({ success: false, message: "Insufficient funds" });
        }

        // Deduct purchase cost from cash balance
        portfolio.cashBalance -= totalPurchaseCost;
        console.log("Remaining Cash Balance after purchase:", portfolio.cashBalance);

        // Update holdings
        const existingHolding = portfolio.holdings.find(holding => holding.symbol === symbol);
        if (existingHolding) {
            // If user already has this symbol in their holdings, update quantity
            existingHolding.quantity += quantity;
        } else {
            // If not, add new holding
            portfolio.holdings.push({ symbol, quantity });
        }

        // Save the updated portfolio
        await portfolio.save();

        return res.status(200).json({ success: true, message: "Stock bought successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Route to sell a stock
router.post("/sell-stock", verifyauthtoken, async (req, res) => {
    try {
        const userId = req.payload._id;
        const { symbol, quantity } = req.body;

        let portfolio = await checkUserPortfolio(userId);
        if (!portfolio) {
            return res.status(400).json({ success: false, message: "User does not have a portfolio" });
        }

        // Fetch the sale amount
        let saleAmount;
        try {
            // First, try to fetch cryptocurrency price
            saleAmount = await getCryptoPrice(symbol);
        } catch (cryptoError) {
            console.error("Error fetching sale amount:", cryptoError);
            return res.status(400).json({ success: false, message: "Error fetching sale amount" });
        }

        // Ensure that saleAmount is a valid number
        if (isNaN(saleAmount) || saleAmount <= 0) {
            console.log("Invalid Sale Amount:", saleAmount);
            return res.status(400).json({ success: false, message: "Invalid sale amount" });
        }

        // Update cash balance with the sale amount
        portfolio.cashBalance += saleAmount * quantity; // Multiply by quantity since it's a sell transaction

        // Save the updated portfolio
        await portfolio.save();

        return res.status(200).json({ success: true, message: "Stock sold successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
// Route to get user's portfolio
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

// Function to check user's portfolio
async function checkUserPortfolio(userId) {
    try {
        // Query the database to find the user's portfolio
        const portfolio = await Portfolio.findOne({ userId });
        if (portfolio) {
            console.log("Existing portfolio found. Cash balance:", portfolio.cashBalance);
        } else {
            console.log("Portfolio not found for user:", userId);
        }
        return portfolio;
    } catch (error) {
        console.error("Error checking user's portfolio:", error);
        return null;
    }
}


module.exports = router;

