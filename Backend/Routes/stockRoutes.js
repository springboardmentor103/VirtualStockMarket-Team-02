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
    const purchased = await purchase.find({ UserId: req.payload._id });
    if (purchased[0].cashBalance < totalamount) {
      return res
        .status(400)
        .json({ succes: false, message: "Not enough balance to buy" });
    }
    purchased[0].purchases.push({
      assetId: getresult.data[cryptoSymbol][0].id,
      assetName: getresult.data[cryptoSymbol][0].name,
      quantity: quantity,
      purchasePrice: totalamount,
      timestamp: Date.now(),
      purchasetype: "BUY",
      status: "In production",
      Info: "NIL",
    });
    purchased[0].cashBalance = purchased[0].cashBalance - totalamount;

    await purchase.findOneAndUpdate({ UserId: req.payload._id }, purchased[0], {
      new: true,
    });
    res.status(200).json({ succes: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ succes: false, message: "Inernal sever error." });
  }
});
router.post("/sell", verifyauthtoken, async (req, res) => {
  try {
    const { cryptoSymbol, quantity } = req.body;
    const getresult = await getCoinData([cryptoSymbol]);
    const currentprice = getresult.data[cryptoSymbol][0].quote.USD.price;
    const purchaseuser = await purchase.find({ UserId: req.payload._id });
    const filtercrypto = purchaseuser[0].purchases.filter((item) => {
      return item.assetName === getresult.data[cryptoSymbol][0].name;
    });
    var sumquantity = 0;
    filtercrypto.forEach((item, index) => {
      sumquantity = sumquantity + item.quantity;
    });
    if (!filtercrypto) {
      return res
        .status(400)
        .json({ success: false, message: "No crypto available to sell." });
    }
    if (sumquantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "crypto trying to sell is greater than you have available.",
      });
    }
    const totalamount = currentprice * quantity;
    purchaseuser[0].cashBalance = purchaseuser[0].cashBalance + totalamount;
    purchaseuser[0].purchases.push({
      assetId: getresult.data[cryptoSymbol][0].id,
      assetName: getresult.data[cryptoSymbol][0].name,
      quantity: -quantity,
      purchasePrice: -totalamount,
      timestamp: Date.now(),
      purchasetype: "SELL",
      status: "In Transit",
      Info: "NIL",
    });
    await purchase.findOneAndUpdate(
      { UserId: req.payload._id },
      purchaseuser[0],
      {
        new: true,
      }
    );
    res.status(200).json({ succes: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ succes: false, message: "Inernal sever error." });
  }
});
module.exports = router;
