
const jwt = require("jsonwebtoken");

// Middleware to verify authentication token
const verifyauthtoken = (req, res, next) => {
  const { authToken } = req.cookies;

  if (!authToken) {
    if (
      ["/otpgenerate", "/otpmatching", "/newpassword", "/verifyemail", "/sendverificationemail"].includes(req.url)
    ) {
      return next();
    }
    return res.status(401).json({ success: false, message: "Access Denied." });
  }

  jwt.verify(authToken, process.env.ACCESS_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ success: false, message: err.name });
    }

    if (
      ["/otpgenerate", "/otpmatching", "/newpassword", "/verifyemail", "/sendverificationemail"].includes(req.url)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Logout first." });
    }

    req.payload = payload;
    next();
  });
};

// Middleware to verify OTP token
const verifyotptoken = (req, res, next) => {
  const { otpToken } = req.cookies;

  if (!otpToken) {
    if (req.url === "/otpmatching") {
      return res.status(401).json({
        success: false,
        message: "Either OTP expired or you didn't generate OTP. Try again.",
      });
    }
    return res.status(401).json({ success: false, message: "Access Denied." });
  }

  jwt.verify(otpToken, process.env.OTP_ACCESS, (err, payload) => {
    if (err) {
      return res.status(401).json({ success: false, message: err.name });
    }

    req.payload = payload;
    next();
  });
};

// Middleware to verify OTP matching token
const verifyotpmatching = (req, res, next) => {
  const { otpmatchToken } = req.cookies;

  if (!otpmatchToken) {
    if (req.url === "/newpassword") {
      return res.status(401).json({
        success: false,
        message: "You should verify OTP first.",
      });
    }
    return res.status(401).json({ success: false, message: "Access Denied." });
  }

  jwt.verify(otpmatchToken, process.env.OTPMATCH_ACCESS, (err, payload) => {
    if (err) {
      return res.status(401).json({ success: false, message: err.name });
    }

    req.payload = payload;
    next();
  });
};

// Function to generate authentication token
const generateauthtoken = (id) => {
  return new Promise((resolve, reject) => {
    const tokenid = { _id: id };

    jwt.sign(
      tokenid,
      process.env.ACCESS_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          return reject(err);
        }
        resolve(token);
      }
    );
  });
};

// Function to generate OTP token
const generateotptoken = (id) => {
  return new Promise((resolve, reject) => {
    const tokenid = { _id: id };

    jwt.sign(
      tokenid,
      process.env.OTP_ACCESS,
      { expiresIn: "10m" },
      (err, token) => {
        if (err) {
          return reject(err);
        }
        resolve(token);
      }
    );
  });
};

// Function to generate OTP matching token
const generateotpmatching = (id) => {
  return new Promise((resolve, reject) => {
    const tokenid = { _id: id };

    jwt.sign(
      tokenid,
      process.env.OTPMATCH_ACCESS,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          return reject(err);
        }
        resolve(token);
      }
    );
  });
};

module.exports = {
  generateauthtoken,
  verifyauthtoken,
  generateotptoken,
  verifyotptoken,
  generateotpmatching,
  verifyotpmatching,
};
