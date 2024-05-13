const axios = require("axios");

const getCoinsData = async () => {
  const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=10";
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

module.exports = { getCoinsData };
