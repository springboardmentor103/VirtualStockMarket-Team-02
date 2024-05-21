//graphWithPrices.js
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { createCanvas, loadImage } = require('canvas');

const generateGraphWithPrices = async (data) => {
  const labels = Object.keys(data);
  const prices = labels.map(label => data[label][0].quote.USD.price);

  const width = 800; 
  const height = 600; 
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

  try {
    const image = await chartJSNodeCanvas.renderToBuffer(configuration);

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const graphImage = await loadImage(image);
    ctx.drawImage(graphImage, 0, 0, width, height);

    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    for (let i = 0; i < labels.length; i++) {
      ctx.fillText(`Price: ${prices[i].toFixed(2)}`, 20, 40 + i * 40);
    }

    return canvas.toBuffer('image/png');
  } catch (error) {
    console.error('Error generating graph with prices:', error);
    throw error;
  }
};

module.exports = { generateGraphWithPrices };

