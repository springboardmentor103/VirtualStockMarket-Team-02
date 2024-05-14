const jwt = require("jsonwebtoken");

const verifyauthtoken = (req, res, next) => {

  if (!req.cookies.authToken) {
    if (req.url !== "/loginuser") {
      return res.status(401).json({ success: false, message: "Unauthorized: No authToken found" });
    } else {
      return res.status(400).json({ success: false, message: "You have already logged in." });
    }
  }


  jwt.verify(req.cookies.authToken, process.env.ACCESS_SECRET, (err, payload) => {
    if (err) {
      if (req.url === "/loginuser") {
        return res.status(400).json({ success: false, message: "You have already logged in." });
      } else {
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid authToken" });
      }
    }

    if (!payload || !payload._id) {
      return res.status(400).json({ success: false, message: "User ID not found in payload" });
    }

    req.payload = payload;

    next();
  });
};

const verifyotptoken = async (req, res, next) => {
  if (!req.cookies.otpToken) {
    if (req.url === `/otpmatching/${req.params._id}`) {
      return res.status(401).json({
        success: false,
        message: "Either OTP expired or you didn't generate OTP. Please try again.",
      });
    }
    return res.status(401).json({ success: false, message: "Access Denied." });
  }
  jwt.verify(req.cookies.otpToken, process.env.OTP_ACCESS, (err, payload) => {
    if (err) {
      return res.status(401).json({ success: false, message: err.name });
    }
    req.payload = payload;
    return next();
  });
};

const verifyotpmatching = async (req, res, next) => {
  if (!req.cookies.otpmatchToken) {
    if (req.url === `/newpassword/${req.params._id}`) {
      return res.status(401).json({
        success: false,
        message: "You should verify OTP first.",
      });
    }
    return res.status(401).json({ success: false, message: "Access Denied." });
  }
  jwt.verify(req.cookies.otpmatchToken, process.env.OTPMATCH_ACCESS, (err, payload) => {
    if (err) {
      return res.status(401).json({ success: false, message: err.name });
    }
    req.payload = payload;
    return next();
  });
};

const generateauthtoken = (id) => {
  return new Promise((resolve, reject) => {
    const tokenid = {
      _id: id,
    };
    jwt.sign(tokenid, process.env.ACCESS_SECRET, { expiresIn: "30d" }, (err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token);
    });
  });
};

const generateotptoken = (id) => {
  return new Promise((resolve, reject) => {
    const tokenid = {
      _id: id,
    };
    jwt.sign(tokenid, process.env.OTP_ACCESS, { expiresIn: "10m" }, (err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token);
    });
  });
};

const generateotpmatching = (id) => {
  return new Promise((resolve, reject) => {
    const tokenid = {
      _id: id,
    };
    jwt.sign(tokenid, process.env.OTPMATCH_ACCESS, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token);
    });
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
