const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/stock-ticker", async (req, res) => {
  try {
    const response = await axios.get("https://api.example.com/real-time-stock-data");
    const stockData = response.data;
    return res.status(200).json({ success: true, stockData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch stock data" });
  }
});

const clientId = "dj0yJmk9UFh1UUc0UlVmdHhKJmQ9WVdrOVpsSkpWMkpPTjNJbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTJi";
const clientSecret = "ad90bbd185e9fdbf4ac39a16820501f0d0b01898";

const authorizationUrl = "https://api.login.yahoo.com/oauth2/request_auth";
const tokenUrl = "https://api.login.yahoo.com/oauth2/get_token";

const redirectUri = "http://localhost:3000/oauth/callback";

router.get("/oauth/authorize", (req, res) => {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
  });

  res.redirect(`${authorizationUrl}?${params}`);
});

router.get("/oauth/callback", async (req, res) => {
  const { code } = req.query;

  const tokenResponse = await axios.post(tokenUrl, {
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    code,
    grant_type: "authorization_code",
  });

  const accessToken = tokenResponse.data.access_token;

  const financeResponse = await axios.get("https://query1.finance.yahoo.com/v7/finance/quote?symbol=AAPL", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

});

module.exports = router;


/*const express = require("express");
const router = express.Router();
const axios = require("axios");

// Get real-time stock price ticker
router.get("/stock-ticker", async (req, res) => {
  try {
    // Fetch real-time stock data from Yahoo Finance API
    const response = await axios.get("https://api.example.com/real-time-stock-data");
    const stockData = response.data;
    return res.status(200).json({ success: true, stockData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch stock data" });
  }
});

// Replace these values with your actual Client ID and Client Secret
const clientId = "dj0yJmk9UFh1UUc0UlVmdHhKJmQ9WVdrOVpsSkpWMkpPTjNJbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTJi";
const clientSecret = "ad90bbd185e9fdbf4ac39a16820501f0d0b01898";

// Yahoo OAuth endpoints
const authorizationUrl = "https://api.login.yahoo.com/oauth2/request_auth";
const tokenUrl = "https://api.login.yahoo.com/oauth2/get_token";

// Redirect URI for OAuth callback (should be registered in your Yahoo App settings)
const redirectUri = "http://localhost:3000/oauth/callback";

// Example route for initiating OAuth flow
router.get("/oauth/authorize", (req, res) => {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
  });

  // Redirect users to Yahoo's authorization URL
  res.redirect(`${authorizationUrl}?${params}`);
});

// Callback route for handling OAuth response
router.get("/oauth/callback", async (req, res) => {
  const { code } = req.query;

  // Exchange authorization code for access token
  const tokenResponse = await axios.post(tokenUrl, {
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    code,
    grant_type: "authorization_code",
  });

  // Extract access token from response
  const accessToken = tokenResponse.data.access_token;

  // Use the access token to make authenticated requests to Yahoo Finance API
  // Example:
  const financeResponse = await axios.get("https://query1.finance.yahoo.com/v7/finance/quote?symbol=AAPL", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // Process financeResponse...
});

module.exports = router;
*/