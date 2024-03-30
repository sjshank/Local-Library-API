const BookInstance = require("../models/bookInstance");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

//Get all the book instances
const getAllBookInstances = asyncHandler(async (req, res) => {
  const result = await BookInstance.find().populate("book").exec();
  res.json(result);
});

//Get book instance details by id
const getBookInstanceById = asyncHandler(async (req, res, next) => {
  const bookInstance = await BookInstance.findById(req.params.id).exec();
  const book = await Book.findById(bookInstance.book._id)
    .populate("author")
    .populate("genre")
    .exec();
  if (bookInstance === null) {
    res.status(404).json({ message: "No record found." });
  }
  res.status(200).json({
    copy: bookInstance,
    book: book,
  });
});

//Create book instance
const createBookInstance = [
  //Middleware to  Validate and sanitize the name field
  body("book", "Book must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("dueDate").escape(),
  //Middleware to process request
  asyncHandler(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(422).json({ message: result.array()[0]["msg"] });
    } else {
      const bookInstanceObj = {
        book: req.body.book,
        imprint: req.body.imprint,
        status: req.body.status,
        due_back: req.body.dueDate ? req.body.dueDate : Date.now(),
      };
      //Author & genre check added to ensure correct data. Not needed when integrate with UI
      const book = await Book.findById(req.body.book).exec();
      if (book == null) {
        res.status(404).json({ message: "Book doesn't exist." });
        return;
      }
      const bookInstance = await BookInstance.create(bookInstanceObj);
      bookInstance.save();
      res.status(201).json(bookInstance);
    }
  }),
];

//Update book instance by id
const updateBookInstanceById = [
  //Middleware to  Validate and sanitize the name field
  body("book", "Book must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("dueDate").escape(),
  //Middleware to process request
  asyncHandler(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(422).json({ message: result.array()[0]["msg"] });
    } else {
      const bookInstanceObj = new BookInstance({
        book: req.body.book,
        imprint: req.body.imprint,
        status: req.body.status,
        due_back: req.body.dueDate ? req.body.dueDate : Date.now(),
        _id: req.params.id,
      });
      //book check added to ensure correct data. Not needed when integrate with UI
      const book = await Book.findById(req.body.book).exec();
      if (book == null) {
        res.status(404).json({ message: "Book doesn't exist." });
        return;
      }
      await BookInstance.findByIdAndUpdate(req.params.id, bookInstanceObj, {});
      res.status(202).json(bookInstanceObj);
    }
  }),
];

//Delete book instance by id
const deleteBookInstanceById = asyncHandler(async (req, res) => {
  await BookInstance.findByIdAndDelete(req.params.id).exec();
  res.status(200).json({ message: "Record deleted." });
});

const BookInstanceController = {
  getAllBookInstances,
  getBookInstanceById,
  createBookInstance,
  updateBookInstanceById,
  deleteBookInstanceById,
};

module.exports = BookInstanceController;
