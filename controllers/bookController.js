const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstances = require("../models/bookInstance");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

//Get all the books
const getAllBooks = asyncHandler(async (req, res) => {
  const result = await Book.find({}, "title author")
    .sort({ title: "asc" })
    .populate("author")
    .exec();
  res.json(result);
});

//Get book details by id
const getBookById = asyncHandler(async (req, res) => {
  const [book, bookInstances] = await Promise.all([
    Book.findById(req.params.id, "-__v")
      .populate("author")
      .populate("genre")
      .exec(),
    BookInstances.find({ book: req.params.id }).exec(),
  ]);
  if (book === null) {
    res.status(200).json({ message: "No record found." });
  }
  res.status(200).json({
    book: book,
    copies: bookInstances,
  });
});

//Create book
const createBook = [
  //Middleware to  Validate and sanitize the name field
  body("title", "Title should be atleast of 3 characters.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("summary", "Summary should be atleast of 5 characters.")
    .trim()
    .isLength({ min: 5 })
    .escape(),
  body("author", "Author must not be empty")
    .trim()
    .isLength({ min: 5 })
    .escape(),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
  //Middleware to process request
  asyncHandler(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(200).json({ message: result.array() });
    } else {
      const bookObj = {
        title: req.body.title,
        summary: req.body.summary,
        author: req.body.author,
        genre: req.body.genre,
        isbn: req.body.isbn,
      };
      //Author & genre check added to ensure correct data. Not needed when integrate with UI
      const author = await Author.findById(req.body.author).exec();
      if (author == null) {
        res.status(200).json({ message: "Author doesn't exist." });
        return;
      }
      const allGenresPromises = [];
      bookObj.genre.forEach((genre) => {
        allGenresPromises.push(Genre.findById(genre).exec());
      });
      const allGenreResult = await Promise.all(allGenresPromises);
      if (allGenreResult.includes(null)) {
        res.status(200).json({ message: "One or more genre doesn't exist." });
        return;
      }
      const found = await Book.findOne({
        title: bookObj.title,
        author: bookObj.author,
        isbn: bookObj.isbn,
      }).exec();
      if (found) {
        res.status(200).json({ message: "Record already exist." });
      } else {
        const book = await Book.create(bookObj);
        book.save();
        res.status(200).json(book);
      }
    }
  }),
];

//Update book by id
const updateBookById = [
  //Middleware to  Validate and sanitize the name field
  body("title", "Title should be atleast of 3 characters.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("summary", "Summary should be atleast of 5 characters.")
    .trim()
    .isLength({ min: 5 })
    .escape(),
  body("author", "Author must not be empty")
    .trim()
    .isLength({ min: 5 })
    .escape(),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
  //Middleware to process request
  asyncHandler(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(200).json({ message: result.array() });
    } else {
      const bookObj = new Book({
        title: req.body.title,
        summary: req.body.summary,
        author: req.body.author,
        genre: req.body.genre,
        isbn: req.body.isbn,
        _id: req.params.id,
      });
      //Author & genre check added to ensure correct data. Not needed when integrate with UI
      const author = await Author.findById(req.body.author).exec();
      if (author == null) {
        res.status(200).json({ message: "Author doesn't exist." });
        return;
      }
      const allGenresPromises = [];
      bookObj.genre.forEach((genre) => {
        allGenresPromises.push(Genre.findById(genre).exec());
      });
      const allGenreResult = await Promise.all(allGenresPromises);
      if (allGenreResult.includes(null)) {
        res.status(200).json({ message: "One or more genre doesn't exist." });
        return;
      }
      await Book.findByIdAndUpdate(req.params.id, bookObj, {});
      res.status(200).json(bookObj);
    }
  }),
];

//Delete book by id
const deleteBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book == null) {
    res.status(200).json({ message: "Record doesn't exist." });
    return;
  }
  const allBookInstances = await BookInstances.find({
    book: [req.params.id],
  }).exec();
  const allBookInstPromises = [];
  allBookInstances.forEach((bookInstance) => {
    allBookInstPromises.push(
      BookInstances.findByIdAndDelete(bookInstance.id).exec()
    );
  });
  await Promise.all(allBookInstPromises);
  await book.deleteOne();
  res.status(200).json({
    message: "Record deleted.",
  });
});

const BookController = {
  getAllBooks,
  getBookById,
  createBook,
  updateBookById,
  deleteBookById,
};

module.exports = BookController;
