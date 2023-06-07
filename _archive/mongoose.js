const mongoose = require("mongoose");
const debug = require("debug")("app:db_old");

// Connection
mongoose
  // .connect("mongodb+srv://dev:p6L4vf2547T1YyXU@cluster0.ozv7qe7.mongodb.net/")
  .connect("mongodb://127.0.0.1/vidly")
  .then(() => debug("Connected to MongoDB..."))
  .catch((err) => debug("Could not connect to MongoDB...", err));

// Schema
const genreSchema = new mongoose.Schema({
  id: Number,
  name: String,
});

// Model
const Genre = new mongoose.model("Genre", genreSchema);

// Operations
async function createGenre(id, name) {
  const genre = new Genre({
    id: id,
    name: name,
  });

  return await genre.save();
}

async function getGenres(id) {
  let query = {};
  if (id) {
    query = { id: id };
  }
  return await Genre.find(query).select({ id: 1, name: 1 });
}

async function updateGenre(id, name) {
  return await Genre.findOneAndUpdate(
    { id: id },
    {
      $set: {
        name: name,
      },
    },
    { new: true }
  );
}

async function removeGenre(id) {
  return await Genre.deleteOne({ id: id });
}

async function run() {
  const result = await removeGenre(6);
  debug(result);
}

// run();

exports.getGenres = getGenres;
exports.createGenre = createGenre;
exports.updateGenre = updateGenre;
exports.removeGenre = removeGenre;
