const mongoose = require("mongoose");
const debug = require("debug")("app:db");

// Connect
mongoose
  .connect("mongodb://127.0.0.1/proppi")
  .then(() => debug("Connected to MongoDB..."))
  .catch((err) => debug("Unable to connect to MongoDB..." + err));


// Queries
async function getProperties() {
  return await Property.find();
}

async function run() {
  const properties = await getProperties();
  debug(properties);
}

// run();

module.exports.getProperties = getProperties