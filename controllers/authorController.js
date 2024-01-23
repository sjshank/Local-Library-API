const Author = require("../models/author");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

//Get all the authors
const getAllAuthors = asyncHandler(async (req, res) => {
  const result = await Author.find({}, "-__v").sort({ first_name: 1 }).exec();
  res.json(result);
});

//Get author by id
const getAuthorById = asyncHandler(async (req, res) => {
  const [author, books] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary")
      .populate("author", "first_name")
      .exec(),
  ]);
  if (author === null) {
    res.status(200).json({ message: "No record found." });
  }
  res.status(200).json({
    author: author,
    books: books,
  });
});

//Create author
const createAuthor = [
  //Middleware to  Validate and sanitize the name field
  body("first_name", "First name should not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("family_name", "Family name should not be empty")
    .trim()
    .isLength({ min: 1 })
    .isAlphanumeric()
    .withMessage("Family name should be not alphanumeric")
    .escape(),
  body("date_of_birth", "Invalid date of birth")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Invalid date of death")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  //Middleware to process request
  asyncHandler(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(200).json({ message: result.array() });
    } else {
      const authorObj = {
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death,
      };
      const found = await Author.findOne({
        first_name: authorObj.first_name,
        family_name: authorObj.family_name,
      }).exec();
      if (found) {
        res.status(200).json({ message: "Record already exist." });
      } else {
        const author = await Author.create(authorObj);
        author.save();
        res.status(200).json(author);
      }
    }
  }),
];

//Update author by id
const updateAuthorById = [
  //Middleware to  Validate and sanitize the name field
  body("first_name", "First name should not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("family_name", "Family name should not be empty")
    .trim()
    .isLength({ min: 1 })
    .isAlphanumeric()
    .withMessage("Family name should be not alphanumeric")
    .escape(),
  body("date_of_birth", "Invalid date of birth")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Invalid date of death")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  //Middleware to process request
  asyncHandler(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(200).json({ message: result.array() });
    } else {
      const authorObj = new Author({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death,
        _id: req.params.id,
      });
      //Author check added to ensure correct data. Not needed when integrate with UI
      const found = await Author.findById(req.params.id).exec();
      if (found == null) {
        res.status(200).json({ message: "Record doesn't exist." });
      } else {
        await Author.findByIdAndUpdate(req.params.id, authorObj, {});
        res.status(200).json(authorObj);
      }
    }
  }),
];

//Delete author by id
const deleteAuthorById = asyncHandler(async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (!author) {
    res.status(200).json({ message: "Record doesn't exist." });
  } else {
    const allBooks = await Book.find({ author: author.id }).exec();
    const allBooksPromises = [];
    allBooks.forEach((book) => {
      allBooksPromises.push(Book.findByIdAndDelete(book.id).exec());
    });
    await Promise.all(allBooksPromises);
    await author.deleteOne();
    res.status(200).json({
      message: "Record deleted.",
    });
  }
});

const AuthorController = {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthorById,
  deleteAuthorById,
};

module.exports = AuthorController;
