//APICoinMarket.js
const express = require('express');
const router = express.Router();
const { generateGraphWithPrices } = require('../Middleware/graphWithPrices');
const { getCoinData } = require('../Middleware/getCoinData');

router.get('/crypto-graph', async (req, res) => {
  const coins = req.query.coins ? req.query.coins.split(',') : [];
  if (coins.length === 0) {
    return res.status(400).send('Please provide at least one cryptocurrency symbol in the query parameter "coins".');
  }
  
  try {

    const data = await getCoinData(coins);
    const currentPrices = coins.reduce((prices, coin) => {
      if (data.data[coin]) {
        prices[coin] = data.data[coin][0].quote.USD.price;
      }
      return prices;
    }, {});

    console.log('Current Prices:', currentPrices);

    const graphWithPricesBuffer = await generateGraphWithPrices(data.data);

    res.set('Content-Type', 'image/png');
    res.send(graphWithPricesBuffer);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
});

module.exports = router;


