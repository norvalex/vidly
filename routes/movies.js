const mongoose = require("mongoose");
const express = require("express");
const debug = require("debug")("app:genre");
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("name");
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  new mongoose.Types.ObjectId(req.params.id);

  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(400).send("Movie not found");

  res.send(movie);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send(new Error("Invalid genre"));

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: parseFloat(req.body.numberInStock),
    dailyRentalRate: parseFloat(req.body.dailyRentalRate),
  });

  await movie.save();
  res.send(movie);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.body.genreId) {
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send(new Error("Invalid genre"));
  }

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: parseFloat(req.body.numberInStock),
      dailyRentalRate: parseFloat(req.body.dailyRentalRate),
    },
    { new: true }
  );

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found");

  res.send(movie);
});

router.delete("/:id", auth, async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

module.exports = router;
