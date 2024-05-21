

/*
const express = require('express');
const axios = require('axios');
const router = express.Router();

async function getCurrentCryptoPrice(cryptoSymbol) {
  const apiKey = 'hwXuc3M1Sfm2AZWa1c6rVw==DyTtTMMUsN0Ef3JA'; 
  const apiUrl = `https://api.api-ninjas.com/v1/cryptoprice?symbol=${cryptoSymbol}USD`;

  try {
    const response = await axios.get(apiUrl, {
      headers: { 'X-Api-Key': apiKey }
    });

    if (response.status !== 200) {
      throw new Error(`Request failed with status code ${response.status}`);
    }

    const responseData = response.data;

    if (!responseData || typeof responseData !== 'object') {
      throw new Error("Invalid response data format");
    }

    const priceString = responseData['price'];

    if (!priceString || isNaN(parseFloat(priceString))) {
      console.warn("Invalid or missing cryptocurrency price. Returning null...");
      return null;
    }

    const currentPrice = parseFloat(priceString);

    return { currentPrice, priceString };
  } catch (error) {
    console.error("Error fetching cryptocurrency price:", error.message);
    throw new Error("Error fetching cryptocurrency price");
  }
}

router.get('/api_ninja', async (req, res) => {
  const symbol = req.query.symbol;

  if (!symbol) {
    return res.status(400).json({ error: 'Symbol parameter is missing' });
  }

  try {
    const { currentPrice, priceString } = await getCurrentCryptoPrice(symbol);
    if (currentPrice === null) {
      return res.status(500).json({ error: 'Failed to fetch the cryptocurrency price' });
    }
    res.json({ symbol, price: currentPrice, priceString });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

*/