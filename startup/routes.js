const genres = require("../routes/genres");
const customers = require("../routes/customers");
const users = require("../routes/users");
const auth = require("../routes/auth");
const rentals = require("../routes/rentals");
const returns = require("../routes/returns");
const movies = require("../routes/movies");
const error = require("../middleware/error");
const home = require("../routes/home");
const morgan = require("morgan");
const express = require("express");
const winston = require("winston");

module.exports = function (app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));

  if (app.get("env") === "development") {
    app.use(morgan("tiny"));
    winston.info("Morgan enabled...");
  }

  // Routing
  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/returns", returns);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/", home);
  app.use(error);
};
