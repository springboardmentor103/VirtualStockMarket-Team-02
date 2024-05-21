//getCoinData.js
const axios = require("axios");
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const getCoinData = async (coins) => {
  const url = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${coins.join(",")}`;
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

const generateGraph = async (data) => {
  const labels = Object.keys(data);
  const prices = labels.map(label => data[label][0].quote.USD.price);

  const width = 800; // width of the chart
  const height = 600; // height of the chart
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

  const configuration = {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Crypto Prices',
        data: prices,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  const image = await chartJSNodeCanvas.renderToBuffer(configuration);
  return image;
};

module.exports = { getCoinData, generateGraph };
