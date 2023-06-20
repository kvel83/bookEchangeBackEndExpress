const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    userName: String,
    userEmail: String,
    userPassword: String,
    userAge: Number,
    role:{
        type: Number
    },
    books: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book"
    }]
  })
);

module.exports = User;