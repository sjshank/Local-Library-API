const Genre = require("../models/genre");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

//Get all genres
const getAllGenres = asyncHandler(async (req, res) => {
  const result = await Genre.find({}, "-__v").sort({ name: 1 }).exec();
  res.json(result);
});

//get genre by id
const getGenreById = asyncHandler(async (req, res, next) => {
  try {
    if (req.params.id) {
      const [genre, booksByGenre] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Book.find({ genre: req.params.id }, "title summary").exec(),
      ]);
      if (genre === null) {
        res.status(404).json({ message: "No record found." });
      }
      res.status(200).json({
        genre: genre,
        books: booksByGenre,
      });
    } else {
      res.status(500).json({ message: "Unable to process request." });
    }
  } catch (err) {
    res.status(503).json({
      message: "Unable to process request. Please try again after sometime",
    });
  }
});

//Create new genre
const createGenre = [
  //Middleware to  Validate and sanitize the name field
  body("name", "Genre should contain at least 3 characters.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  //Middleware to process request
  asyncHandler(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(422).json({ message: result.array()[0]["msg"] });
    } else {
      const found = await Genre.findOne({ name: req.body.name }).exec();
      if (found) {
        res.status(409).json({ message: "Record already exist." });
      } else {
        const genre = await Genre.create({ name: req.body.name });
        genre.save();
        res.status(201).json(genre);
      }
    }
  }),
];

//Update genre by id
const updateGenreById = [
  //Middleware to  Validate and sanitize the name field
  body("name", "Genre should contain at least 3 characters.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  //Middleware to process request
  asyncHandler(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(422).json({ message: result.array()[0]["msg"] });
    } else {
      const found = await Genre.findById(req.params.id).exec();
      if (found == null) {
        res.status(409).json({ message: "Record doesn't exist." });
      } else {
        await Genre.findByIdAndUpdate(
          req.params.id,
          { name: req.body.name },
          {}
        );
        res.status(202).json({ name: req.body.name });
      }
    }
  }),
];

//Delete genre by id
const deleteGenreById = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id);
  if (genre == null) {
    res.status(404).json({ message: "Record doesn't exist." });
    return;
  }
  const allBooks = await Book.find({
    genre: [req.params.id],
  }).exec();
  const allBooksPromises = [];
  allBooks.forEach((book) => {
    allBooksPromises.push(Book.findByIdAndDelete(book.id).exec());
  });
  await Promise.all(allBooksPromises);
  await genre.deleteOne();
  res.status(200).json({
    message: "Record deleted.",
  });
});

const GenreController = {
  getAllGenres,
  getGenreById,
  createGenre,
  updateGenreById,
  deleteGenreById,
};

module.exports = GenreController;
