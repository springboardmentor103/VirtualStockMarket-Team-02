const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to the Virtual Stock Market App');
});

module.exports = router;
