<<<<<<< HEAD
const axios = require("axios");

const getCoinsData = async () => {
  const url =
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=50";
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
=======
const axios = require("axios");

const getCoinsData = async () => {
  const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=50";
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
>>>>>>> 465c35f9ce83da72e5252f6a7cfebdc2f5c3993d
