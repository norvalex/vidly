const winston = require("winston");
// require("winston-mongodb");
require("express-async-errors");

// TODO: Consider upgrading to Winston@3 or using another logger like Pino

module.exports = function () {
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  winston.add(winston.transports.File, {
    filename: "logfile.log",
    level: "warn",
  });
  // winston.add(winston.transports.MongoDB, {
  //   db: "mongodb://127.0.0.1/vidly",
  //   level: "warn",
  // });
};
