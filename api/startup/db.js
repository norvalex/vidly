const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

// Database Connection
module.exports = function () {
  const db = config.get("db");
  mongoose.connect(db).then(() => winston.info(`Connected to ${db}...`));
};

// Change connection strings in /config/default.json, test.json etc.
// For Mongodb Atlas (Cloud hosted solution)
// "mongodb+srv://dev:p6L4vf2547T1YyXU@cluster0.ozv7qe7.mongodb.net/vidly"

// For Mongodb-community (localhost / 127.0.0.1)
// "mongodb://127.0.0.1"
