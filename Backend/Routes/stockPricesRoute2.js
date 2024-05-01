const express = require("express");
const https = require("https");

const router = express.Router();

function getCryptoPrice(symbol, callback) {
  const apiKey = 'hwXuc3M1Sfm2AZWa1c6rVw==DyTtTMMUsN0Ef3JA'; 

  const options = {
    hostname: 'api.api-ninjas.com',
    path: `/v1/cryptoprice?symbol=${symbol}`,
    headers: {
      'X-Api-Key': apiKey
    }
  };

  https.get(options, response => {
    let data = '';

    response.on('data', chunk => {
      data += chunk;
    });

    response.on('end', () => {
      callback(null, data);
    });
  }).on('error', error => {
    callback(error, null);
  });
}

router.get("/stock_prices2", (req, res) => {
  const symbol = req.query.symbol;

  if (!symbol) {
    return res.status(400).json({ error: 'Symbol parameter is missing' });
  }

  getCryptoPrice(symbol, (error, data) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  });
});

module.exports = router;


//example api call to api ninja
//    http://localhost:8000/api/stock_prices2?symbol=BTCUSD