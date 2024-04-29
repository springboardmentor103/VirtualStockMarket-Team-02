const axios = require("axios");

const STOCK_API_URL = 'https://query1.finance.yahoo.com/v7/finance/quote';

async function getStockData(stockSymbol) {
  try {
    const response = await axios.get(`${STOCK_API_URL}/${stockSymbol}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching stock data: ${error.message}`);
  }
}

module.exports = {
  getStockData,
};
