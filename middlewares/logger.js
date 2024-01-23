const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

// create a write stream (in append mode)
if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
  (async () => {
    await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
  })();
}
const logger = fs.createWriteStream(
  path.join(__dirname, "..", "logs", "error.log"),
  {
    flags: "a",
  }
);

module.exports = logger;
