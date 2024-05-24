
//APICoinMarket.js
const express = require("express");
const router = express.Router();
const { getCoinData, isCoinValid } = require("../Middleware/getCoinData");
const { verifyauthtoken } = require("../Middleware/authtoken");
router.get("/single-crypto", verifyauthtoken, async (req, res) => {
  const coin = req.query.coin ? req.query.coin : "";
  if (!coin) {
    return res
      .status(400)
      .send(
        'Please provide at least one cryptocurrency symbol in the query parameter "coins".'
      );
  }

  try {
    const valid = await isCoinValid(coin);
    if (!valid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid cryptocurrency symbol." });
    }
    const data = await getCoinData(coin);
    res.status(200).json({
      success: true,
      singledata: data,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
});

module.exports = router;
