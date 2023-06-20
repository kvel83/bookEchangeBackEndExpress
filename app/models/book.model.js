const mongoose = require("mongoose");

const Book = mongoose.model(
  "Book",
  new mongoose.Schema({
    bookName: String,
    bookAuthor: String,
    bookEditorial: String,
    bookPages: Number,
    bookClasification: String,
    bookISBN: String,
    bookDescription: String,
  })
);

module.exports = Book;