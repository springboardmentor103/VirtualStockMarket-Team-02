const axios = require("axios");

const getCoinsData = async () => {
  const url = `https://yfapi.net/v1/finance/trending/US`;
  const headers = {
    "X-CMC_PRO_API_KEY": process.env.API_KEY,
  };

  try {
    const response = await axios.get(url, { headers });
    const financedata = response.data.finance.result[0].quotes;
    return financedata;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

module.exports = { getCoinsData };
