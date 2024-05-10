const axios = require("axios");

async function getCurrentCryptoPrice(cryptoSymbol) {
  try {
    // Manually add support for USDC and USDT
    if (cryptoSymbol === 'USDC' || cryptoSymbol === 'USDT') {
      const apiUrl = `http://localhost:8000/api/api_ninja?symbol=${cryptoSymbol}`;

      const response = await axios.get(apiUrl);

      const responseData = response.data;
      const priceString = responseData['price'];

      if (!priceString || isNaN(parseFloat(priceString))) {
        throw new Error("Invalid or missing cryptocurrency price");
      }

      const currentPrice = parseFloat(priceString);

      return currentPrice;
    } else {
      // For other symbols, check and append 'USD' if necessary
      let formattedSymbol = cryptoSymbol;
      if (!cryptoSymbol.endsWith('USD')) {
        formattedSymbol += 'USD';
      }

      const apiUrl = `http://localhost:8000/api/api_ninja?symbol=${formattedSymbol}`;

      const response = await axios.get(apiUrl);

      const responseData = JSON.parse(response.data);

      const priceString = responseData['price'];

      if (!priceString || isNaN(parseFloat(priceString))) {
        throw new Error("Invalid or missing cryptocurrency price");
      }

      const currentPrice = parseFloat(priceString);

      return currentPrice;
    }
  } catch (error) {
    console.error("Error fetching cryptocurrency price:", error.message);
    throw new Error("Error fetching cryptocurrency price");
  }
}

module.exports = getCurrentCryptoPrice;

/*
const axios = require("axios");
async function getCurrentCryptoPrice(cryptoSymbol) {
  try {
    if (!cryptoSymbol.includes('USD')) {
      cryptoSymbol += 'USD';
    }

    const apiUrl = `http://localhost:8000/api/api_ninja?symbol=${cryptoSymbol}`;

    const response = await axios.get(apiUrl);

    const responseData = JSON.parse(response.data);

    const priceString = responseData['price'];

    if (!priceString || isNaN(parseFloat(priceString))) {
      throw new Error("Invalid or missing cryptocurrency price");
    }

    const currentPrice = parseFloat(priceString);

    return currentPrice;
  } catch (error) {
    console.error("Error fetching cryptocurrency price:", error.message);
    throw new Error("Error fetching cryptocurrency price");
  }
}

module.exports = getCurrentCryptoPrice;
*/