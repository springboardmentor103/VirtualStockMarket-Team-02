const express = require("express");
const router = express.Router();
const { verifyauthtoken } = require("../Middleware/authtoken");
const { getCoinData } = require("../Middleware/getCoinData");
const purchase = require("../Models/Purchase");

router.post("/buy", verifyauthtoken, async (req, res) => {
  try {
    const { cryptoSymbol, quantity } = req.body;
    const getresult = await getCoinData([cryptoSymbol]);
    const currentprice = getresult.data[cryptoSymbol][0].quote.USD.price;
    const totalamount = currentprice * quantity;
    const userPurchases = await purchase.findOne({ UserId: req.payload._id });

    if (userPurchases.cashBalance < totalamount) {
      return res.status(400).json({ success: false, message: "Not enough balance to buy" });
    }

    userPurchases.purchases.push({
      assetId: getresult.data[cryptoSymbol][0].id,
      assetName: getresult.data[cryptoSymbol][0].name,
      quantity: quantity,
      purchasePrice: totalamount,
      timestamp: Date.now(),
      purchasetype: "BUY",
      status: "In production",
      Info: "NIL",
    });
    userPurchases.cashBalance -= totalamount; 

    await userPurchases.save(); 
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

router.post("/sell", verifyauthtoken, async (req, res) => {
  try {
    const { cryptoSymbol, quantity } = req.body;
    const getresult = await getCoinData([cryptoSymbol]);
    const currentprice = getresult.data[cryptoSymbol][0].quote.USD.price;
    const userPurchases = await purchase.findOne({ UserId: req.payload._id });
    const filteredCrypto = userPurchases.purchases.filter((item) => {
      return item.assetName === getresult.data[cryptoSymbol][0].name;
    });

    if (!filteredCrypto.length) {
      return res.status(400).json({ success: false, message: "No crypto available to sell." });
    }

    var sumQuantity = 0;
    filteredCrypto.forEach((item) => {
      sumQuantity += item.quantity;
    });

    if (sumQuantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "The quantity of crypto to sell is greater than what you have available.",
      });
    }

    const totalAmount = currentprice * quantity;
    userPurchases.cashBalance += totalAmount; 
    userPurchases.purchases.push({
      assetId: getresult.data[cryptoSymbol][0].id,
      assetName: getresult.data[cryptoSymbol][0].name,
      quantity: -quantity, 
      purchasePrice: totalAmount,
      timestamp: Date.now(),
      purchasetype: "SELL",
      status: "In Transit",
      Info: "NIL",
    });
    await userPurchases.save(); 
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

module.exports = router;
