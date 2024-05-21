//APICoinMarket.js
const express = require('express');
const router = express.Router();
const { getCoinData } = require('../Middleware/getCoinData');

router.get('/single-crypto', async (req, res) => {
  const coins = req.query.coin ? req.query.coin : [];
  if (coins.length === 0) {
    return res.status(400).send('Please provide at least one cryptocurrency symbol in the query parameter "coins".');
  }
  
  try {

    const data = await getCoinData(coins);
   res.status(200).json({
      success: true,
      singledata: data,
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred while processing your request.",
      });
  }
});

module.exports = router;


