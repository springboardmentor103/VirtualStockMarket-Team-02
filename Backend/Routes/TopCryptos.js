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

router.get("/topcryptos", (req, res) => {
  const symbols = ['BTCUSD', 'ETHUSD', 'XRPUSD', 'LTCUSD', 'BCHUSD', 'ADAUSD', 'BNBUSD', 'DOGEUSD', 'XLMUSD', 'LINKUSD'];

  const cryptoPrices = {};

  const fetchPrices = (index) => {
    if (index === symbols.length) {
      const sortedCryptos = Object.entries(cryptoPrices)
        .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))
        .slice(0, 10)
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});
      res.json(sortedCryptos);
      return;
    }

    const symbol = symbols[index];
    getCryptoPrice(symbol, (error, data) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      const price = JSON.parse(data).price;
      cryptoPrices[symbol] = price;
      fetchPrices(index + 1);
    });
  };

  fetchPrices(0);
});

module.exports = router;
