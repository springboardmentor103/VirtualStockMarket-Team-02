const { validationResult } = require("express-validator");
const validatecreateuser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = {};
    errors.array().forEach((error) => {
      if (!errorMessages[error.path]) {
        errorMessages[error.path] = [];
      }
      errorMessages[error.path].push(error.msg);
    });
    return res.status(400).json({ success: false, message: errorMessages });
  }
  next();
};
const validateloginuser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }
  next();
};
const validateotpgeneration = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = {};
    errors.array().forEach((error) => {
      if (!errorMessages[error.path]) {
        errorMessages[error.path] = [];
      }
      errorMessages[error.path].push(error.msg);
    });
    return res.status(400).json({ success: false, message: errorMessages });
  }
  next();
};
const validateotpmatching = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = {};
    errors.array().forEach((error) => {
      if (!errorMessages[error.path]) {
        errorMessages[error.path] = [];
      }
      errorMessages[error.path].push(error.msg);
    });
    return res.status(400).json({ success: false, message: errorMessages });
  }
  next();
};
const validatenewpassword = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = {};
    errors.array().forEach((error) => {
      if (!errorMessages[error.path]) {
        errorMessages[error.path] = [];
      }
      errorMessages[error.path].push(error.msg);
    });
    return res.status(400).json({ success: false, message: errorMessages });
  }
  next();
};
module.exports = {
  validatecreateuser,
  validateloginuser,
  validateotpgeneration,
  validateotpmatching,
  validatenewpassword,
};
