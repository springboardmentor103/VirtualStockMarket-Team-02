const axios = require("axios");
const getValidSymbols = async () => {
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest`;
  const headers = {
    "X-CMC_PRO_API_KEY": process.env.API_KEY,
  };

  try {
    const response = await axios.get(url, { headers });
    const validSymbols = response.data.data.map((coin) => coin.symbol);
    // const validName = response.data.data.map((coin) => coin.name);
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
