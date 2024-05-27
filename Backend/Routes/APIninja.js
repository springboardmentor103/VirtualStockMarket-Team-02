const express = require("express");
const router = express.Router();
const https = require("https");

// Define the getCryptoPrice function
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

// Define the route handler
router.get("/api_ninja", (req, res) => {
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
