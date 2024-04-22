const express = require("express");
const router = express.Router();

// Dashboard Route
router.post("/dashboard", (req, res) => {
    res.json({msg: "Welcome to the dashboard page"});
});

module.exports = router;