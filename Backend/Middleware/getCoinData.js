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
