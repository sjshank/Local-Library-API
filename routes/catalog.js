const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const BookController = require("../controllers/bookController");
const AuthorController = require("../controllers/authorController");
const BookInstanceController = require("../controllers/bookinstanceController");
const GenreController = require("../controllers/genreController");
const retrieveDashboard = require("../controllers/dashboardController");

router.get("/", (req, res, next) => {
  retrieveDashboard(req, res);
});

//Book route
router
  .post("/book/create", BookController.createBook)
  .post("/book/:id/update", BookController.updateBookById)
  .post("/book/:id/delete", BookController.deleteBookById)
  .get("/books", BookController.getAllBooks)
  .get("/book/:id", BookController.getBookById);

//Author route
router
  .post("/author/create", AuthorController.createAuthor)
  .post("/author/:id/update", AuthorController.updateAuthorById)
  .post("/author/:id/delete", AuthorController.deleteAuthorById)
  .get("/authors", AuthorController.getAllAuthors)
  .get("/author/:id", AuthorController.getAuthorById);

//Book Instance route
router
  .post("/bookinstance/create", BookInstanceController.createBookInstance)
  .post(
    "/bookinstance/:id/update",
    BookInstanceController.updateBookInstanceById
  )
  .post(
    "/bookinstance/:id/delete",
    BookInstanceController.deleteBookInstanceById
  )
  .get("/bookinstances", BookInstanceController.getAllBookInstances)
  .get("/bookinstance/:id", BookInstanceController.getBookInstanceById);

//Genre route
router
  .post("/genre/create", GenreController.createGenre)
  .post("/genre/:id/update", GenreController.updateGenreById)
  .post("/genre/:id/delete", GenreController.deleteGenreById)
  .get("/genres", GenreController.getAllGenres)
  .get("/genre/:id", GenreController.getGenreById);

module.exports = router;
