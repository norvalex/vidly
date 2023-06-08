const debug = require("debug")("app:logger");

function log(req, res, next) {
  debug("Logging...");
  next();
}

module.exports = log;
