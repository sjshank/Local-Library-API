const Book = require("../models/book");
const Author = require("../models/author");
const BookInstance = require("../models/bookInstance");
const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");

const retrieveDashboard = asyncHandler(async (req, res) => {
  const [
    numBooks,
    numBookInstances,
    numBookInstancesAvl,
    numAuthors,
    numGenres,
  ] = await Promise.all([
    Book.countDocuments({}).exec(),
    BookInstance.countDocuments({}).exec(),
    BookInstance.countDocuments({ status: "Available" }),
    Author.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
  ]);

  res.json({
    booksCount: numBooks,
    bookInstancesCount: numBookInstances,
    bookInstancesAvlCount: numBookInstancesAvl,
    authorsCount: numAuthors,
    genresCount: numGenres,
  });
});

module.exports = retrieveDashboard;
