const winston = require("winston");

function error(err, req, res, next) {
  winston.error({
    message: err.message,
    metadata: { name: err.name, stack: err.stack },
  });

  res.status(500).send("Something failed");
}

module.exports = error;
