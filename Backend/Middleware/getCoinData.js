<<<<<<< HEAD
const axios = require("axios");
const getValidSymbols = async () => {
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest`;
  const headers = {
    "X-CMC_PRO_API_KEY": process.env.API_KEY,
  };

  try {
    const response = await axios.get(url, { headers });
    const validSymbols = response.data.data.map((coin) => coin.symbol);
    return { validSymbols };
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

const isCoinValid = async (coin) => {
  const validCrypto = await getValidSymbols();
  return validCrypto.validSymbols.includes(coin.toUpperCase());
};
const getCoinData = async (coin) => {
  const url = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${coin}`;
  const headers = {
    "X-CMC_PRO_API_KEY": process.env.API_KEY,
  };

  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

module.exports = { getCoinData, isCoinValid };
=======
const axios = require("axios");

const getCoinData = async (coins) => {
  const url = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${coins.join(
    ","
  )}`;
  const headers = {
    "X-CMC_PRO_API_KEY": process.env.API_KEY,
  };

  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

module.exports = { getCoinData };
>>>>>>> 465c35f9ce83da72e5252f6a7cfebdc2f5c3993d
