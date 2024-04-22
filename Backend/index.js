const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(
    //"MongoDB connected"
  ))
  .catch((err) => console.log(err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/forgot", require("./routes/forgetPassword"));
app.use("/api/reset", require("./routes/resetPassword"));
app.use("/api/dashboard", require("./routes/dashboardRoute"));

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    //console.log(`Server running on port ${port}`)
}
);

