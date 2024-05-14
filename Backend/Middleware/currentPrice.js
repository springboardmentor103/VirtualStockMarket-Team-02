const axios = require('axios'); 
async function getCurrentCryptoPrice(cryptoSymbol) {
  let apiUrl;

  switch (cryptoSymbol) {
    case 'USDC':
    case 'USDT':
      apiUrl = `http://localhost:8000/api/api_ninja?symbol=${cryptoSymbol}USD`;
      break;
    default:
      apiUrl = `http://localhost:8000/api/api_ninja?symbol=${cryptoSymbol}USD`;
      break;
  }

  try {
    const response = await axios.get(apiUrl);

    if (response.status !== 200) {
      throw new Error(`Request failed with status code ${response.status}`);
    }

    const responseData = response.data;

    const parsedData = typeof responseData === 'string' ? JSON.parse(responseData) : responseData;

    if (!parsedData || typeof parsedData !== 'object') {
      throw new Error("Invalid response data format");
    }

    const priceString = parsedData['price'];

    if (!priceString || isNaN(parseFloat(priceString))) {
      console.warn("Invalid or missing cryptocurrency price. Returning null...");
      return null;
    }

    const currentPrice = parseFloat(priceString);

    return currentPrice;
  } catch (error) {
    console.error("Error fetching cryptocurrency price:", error.message);
    throw new Error("Error fetching cryptocurrency price");
  }
}

module.exports = getCurrentCryptoPrice;

