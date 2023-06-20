require('dotenv').config();
const db = require("../models");
const Book = db.book;
const User = db.user;

let jwt = require("jsonwebtoken");

exports.getAllBooksByUser = async(req, res) => {
    try {
        let id = req.params.id;
        const user = await User.findById(id).populate("books");
        if (!user){
            res.status(404).send({message: "Usuario no encontrado"});
        }else{
            const books = user.books;
            if (books){
                res.status(200).send(books);
            }else{
                res.status(400).send({message: "Usuario no tiene ningún libro"});
            };
        }
    } catch (error) {
        res.status(500).send({message: "Error en el servidor"});
    }
};

exports.getBookById = async(req,res) => {
    const id = req.params.id;
    const bookId = req.body._id;
    try {
        if (bookId){
            const book = await Book.findById(bookId);
            if (book){
                res.status(200).json(book);
            }else{
                res.status(400).json({message: "Descripción del libro no encontrada"});
            }
        }else{
            res.status(400).json({message: "Se necesita un ID de libro válido"});
        }
    } catch (error) {
        res.status(500).json({message: "Error de conexión con el servidor"});
    };
};

exports.updateBook = async(req,res) => {
    const bookId = req.params._id;
    try {
        if(bookId){
            await Book.updateOne(
                { _id: bookId },
                { $set: {
                    bookName: req.body.bookName,
                    bookAuthor: req.body.bookAuthor,
                    bookEditorial: req.body.bookEditorial,
                    bookPages: req.body.bookPages,
                    bookClasification: req.body.bookClasification,
                    bookISBN: req.body.bookISBN,
                    bookDescription: req.body.bookDescription,
                }}
            )
            .exec((err, book) => {
                if (err){
                    res.status(500).json({ message: "Error en la actualizacion del libro " + err.message });
                }else{
                    res.status(200).json(book);
                }
            });
        }else{
            res.status(400).json({ message: "Se necesita un ID de libro válido"})
        }
    } catch (error) {
        res.status(500).json({ message: "Error de conexión al seridor" })
    }
}

exports.addBook = async(req, res) => {
    const id = req.params.id;
    const user = await User.findById(id).exec();
    console.log(id);
    console.log(user);
    console.log(req.body.bookISBN);
    console.log(req.body);
    let book = await Book.findOne({bookISBN: req.body.bookISBN}).exec();
    try {
        if (!book){
            book = new Book({
                bookName: req.body.bookName,
                bookAuthor: req.body.bookAuthor,
                bookEditorial: req.body.bookEditorial,
                bookPages: req.body.bookPages,
                bookClasification: req.body.bookClasification,
                bookISBN: req.body.bookISBN,
                bookDescription: req.body.bookDescription
            });
            await book.save();
        }
        user.books.push(book._id);
        const updateResult = User.updateOne(
            { _id: id},
            { $set:
                {
                    books: user.books
                }
            });
            console.log(updateResult.modifiedCount);
            console.log(updateResult);
        if (updateResult.modifiedCount === 1){
            res.status(200).send({message: "Libro insertado correctamente"});
        }else{
            res.status(404).send({message: "Libro no encontrado"});
        }

    } catch (error) {
        return res.status(500).send({message: error.message});
    }
};

exports.deleteBook = async (req, res) => {
  const id = req.params.id;
  const bookISBN = req.body.bookISBN;
  console.log(req.body);


  try {
    const book = await Book.findOne({ bookISBN });
    console.log("libro en delete: ",book);
    if (!book) {
      return res.status(404).json({ message: 'El libro no fue encontrado.' });
    }

    const bookId = book._id.toString();
    console.log("id en delete book: ", id);
    console.log("bookId en delete book: ", bookId);

    const user = await User.findByIdAndUpdate(
      id,
      { $pull: { books: bookId } },
      { new: true }
    ).populate("books")
    .exec();

    if (!user) {
      return res.status(404).json({ message: 'El usuario no fue encontrado.' });
    }

    console.log("Usuario actualizado: ", user);

    res.status(200).json({ books: user.books });
  } catch (error) {
    console.error("Error en el servidor: ", error);
    res.status(500).json({ message: "Error de conexión al servidor." });
  }
};