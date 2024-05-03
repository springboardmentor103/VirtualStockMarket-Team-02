const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/stock-price', async (req, res) => {
  try {
    // Fetch real-time stock price data from CoinMarketCap API
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?CMC_PRO_API_KEY=d369ff53-a07d-4fa8-908c-a19877b79ad6');

    const stockData = response.data;

    // Send the stock data as response
    res.status(200).json(stockData);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
