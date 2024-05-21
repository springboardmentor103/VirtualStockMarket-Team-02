/*const express = require("express");
const axios = require("axios");
const router = express.Router();

async function getCurrentCryptoPrice(cryptoSymbol) {
  const apiKey = "hwXuc3M1Sfm2AZWa1c6rVw==DyTtTMMUsN0Ef3JA";
  const apiUrl = `https://api.api-ninjas.com/v1/cryptoprice?symbol=${cryptoSymbol}USD`;

  try {
    const response = await axios.get(apiUrl, {
      headers: { "X-Api-Key": apiKey },
    });

    if (response.status !== 200) {
      throw new Error(`Request failed with status code ${response.status}`);
    }

    const responseData = response.data;

    if (!responseData || typeof responseData !== "object") {
      throw new Error("Invalid response data format");
    }

    const priceString = responseData["price"];

    if (!priceString || isNaN(parseFloat(priceString))) {
      console.warn(
        "Invalid or missing cryptocurrency price. Returning null..."
      );
      return null;
    }

    const currentPrice = parseFloat(priceString);

    return { currentPrice, priceString };
  } catch (error) {
    console.error("Error fetching cryptocurrency price:", error.message);
    throw new Error("Error fetching cryptocurrency price");
  }
}

router.get("/api_ninja", async (req, res) => {
  const symbol = req.query.symbol;

  if (!symbol) {
    return res.status(400).json({ error: "Symbol parameter is missing" });
  }

  try {
    const { currentPrice, priceString } = await getCurrentCryptoPrice(symbol);
    if (currentPrice === null) {
      return res
        .status(500)
        .json({ error: "Failed to fetch the cryptocurrency price" });
    }
    res.json({ symbol, price: currentPrice, priceString });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;*/
//APICoinMarket.js
const express = require("express");
const router = express.Router();
const { getCoinData, isCoinValid } = require("../Middleware/getCoinData");

router.get("/single-crypto", async (req, res) => {
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
