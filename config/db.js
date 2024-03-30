const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const connectToDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('Invalid/Missing: "MONGODB_URI"');
    }
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (err) {
    console.log(err);
  }
};
module.exports = connectToDB;
