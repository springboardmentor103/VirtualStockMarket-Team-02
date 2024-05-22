const express = require("express");
const router = express.Router();
const { verifyauthtoken } = require("../Middleware/authtoken");
const { getCoinData } = require("../Middleware/getCoinData");
const purchase = require("../Models/Purchase");

router.post("/buy", verifyauthtoken, async (req, res) => {
  try {
    const { cryptoSymbol, quantity, cryptoname } = req.body;
    if (!cryptoSymbol || cryptoSymbol.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Crypto symbol is required" });
    }

    if (!req.payload || !req.payload._id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID not found in payload" });
    }

    const getresult = await getCoinData(cryptoSymbol);
    if (!getresult.data || !getresult.data[cryptoSymbol]) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid crypto symbol" });
    }
    const result = getresult.data[cryptoSymbol]
      .filter((item) => item.name === cryptoname)
      .map((item) => item);
    const currentPrice = result[0].quote.USD.price;

    let purchaseUser = await purchase.findOne({ UserId: req.payload._id });
    if (!purchaseUser) {
      purchaseUser = new purchase({
        UserId: req.payload._id,
        cashBalance: 1000, // Set default cash balance
        purchases: [],
      });
    }

    const totalAmount = currentPrice * quantity;
    if (purchaseUser.cashBalance < totalAmount) {
      return res
        .status(400)
        .json({ success: false, message: "Not enough balance to buy" });
    }

    purchaseUser.cashBalance -= totalAmount;

    purchaseUser.purchases.push({
      cryptoSymbol,
      quantity,
      purchasePrice: currentPrice,
      timestamp: new Date(),
      purchasetype: "BUY",
      status: "COMPLETED",
      info: "",
      assetName: cryptoname,
      purchasepercent: result[0].quote.USD.percent_change_1h,
    });

    await purchaseUser.save();
    res.status(200).json({ success: true, message: "Purchase successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

router.post("/sell", verifyauthtoken, async (req, res) => {
  try {
    const { cryptoSymbol, quantity, cryptoname } = req.body;
    if (!cryptoSymbol || cryptoSymbol.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Crypto symbol is required" });
    }

    if (!req.payload || !req.payload._id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID not found in payload" });
    }

    const getresult = await getCoinData(cryptoSymbol);
    if (!getresult.data || !getresult.data[cryptoSymbol]) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid crypto symbol" });
    }
    const result = getresult.data[cryptoSymbol]
      .filter((item) => item.name === cryptoname)
      .map((item) => item);
    const currentPrice = result[0].quote.USD.price;

    let purchaseUser = await purchase.findOne({ UserId: req.payload._id });
    if (!purchaseUser) {
      return res
        .status(400)
        .json({ success: false, message: "User has no purchase record" });
    }

    const totalAmount = currentPrice * quantity;

    purchaseUser.cashBalance += totalAmount;

    purchaseUser.purchases.push({
      cryptoSymbol,
      quantity,
      purchasePrice: currentPrice,
      timestamp: new Date(),
      purchasetype: "SELL",
      status: "COMPLETED",
      info: "",
      assetName: cryptoname,
      purchasepercent: result[0].quote.USD.percent_change_1h,
    });

    await purchaseUser.save();
    res.status(200).json({ success: true, message: "Sale successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

module.exports = router;
