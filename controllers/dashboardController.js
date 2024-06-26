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

  res.json([
    {
      label: "Books Listed",
      count: numBooks,
      muiIcon: "LibraryBooksRounded",
    },
    {
      label: "Authors Registered",
      count: numAuthors,
      muiIcon: "SupervisedUserCircleRounded",
    },
    {
      label: "Genres Available",
      count: numGenres,
      muiIcon: "CategoryRounded",
    },
    {
      label: "Book Instances",
      count: numBookInstances,
      muiIcon: "ContentCopyRounded",
    },
    {
      label: "Copies Available",
      count: numBookInstancesAvl,
      muiIcon: "EventAvailableRounded",
    },
  ]);
});

module.exports = retrieveDashboard;
