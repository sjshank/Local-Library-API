const createError = require("http-errors");
const express = require("express");
const app = express();
const path = require("path");
//Load env file data
require("dotenv").config();
const cookieParser = require("cookie-parser");
const logger = require("./middlewares/logger");
const morgan = require("morgan");
const limiter = require("./middlewares/limiter");
const helmet = require("./config/helmet");
const catalogRouter = require("./routes/catalog");
//compress all the HTTP response
const compression = require("compression");

const connectToDB = require("./config/db");
//Call the db connect call & make a connection
connectToDB();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(
  morgan("combined", {
    skip: function (req, res) {
      return res.statusCode < 400;
    },
    stream: logger,
  })
);

// Apply rate limiter to all requests
app.use(limiter);
app.use(helmet());
app.disable("x-powered-by");
// app.use(logger("short"));
app.use(compression()); // Compress all routes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "/public")));

app.use("/catalog", catalogRouter);
// app.use("/", (req, res) => res.redirect("/catalog"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
