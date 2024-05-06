const express = require("express");
const https = require("https");

const router = express.Router();

function getCryptoPrice(symbol) {
  const apiKey = 'hwXuc3M1Sfm2AZWa1c6rVw==DyTtTMMUsN0Ef3JA'; 

  const options = {
    hostname: 'api.api-ninjas.com',
    path: `/v1/cryptoprice?symbol=${symbol}`,
    headers: {
      'X-Api-Key': apiKey
    }
  };

  return new Promise((resolve, reject) => {
    https.get(options, response => {
      let data = '';

      response.on('data', chunk => {
        data += chunk;
      });

      response.on('end', () => {
        // Parse the data before resolving the promise
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData.price); // Assuming 'price' is the key for crypto price in the response
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', error => {
      reject(error);
    });
  });
}

router.get("/stock_crypto_price", (req, res) => {
  const symbol = req.query.symbol;

  if (!symbol) {
    return res.status(400).json({ error: 'Symbol parameter is missing' });
  }

  getCryptoPrice(symbol)
    .then(price => {
      res.json({ price });
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});

module.exports = { router, getCryptoPrice };
