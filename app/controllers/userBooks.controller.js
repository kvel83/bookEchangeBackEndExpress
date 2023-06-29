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
            console.log("books en userBooks: ", books.length);
            if (books.length > 0){
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
    const bookId = req.params.id;
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

// exports.updateBook = async(req,res) => {
    // const bookId = req.params._id;
    // try {
        // if(bookId){
            // await Book.updateOne(
                // { _id: bookId },
                // { $set: {
                    // bookName: req.body.bookName,
                    // bookAuthor: req.body.bookAuthor,
                    // bookEditorial: req.body.bookEditorial,
                    // bookPages: req.body.bookPages,
                    // bookClasification: req.body.bookClasification,
                    // bookISBN: req.body.bookISBN,
                    // bookDescription: req.body.bookDescription,
                // }}
            // )
            // .exec((err, book) => {
                // if (err){
                    // res.status(500).json({ message: "Error en la actualizacion del libro " + err.message });
                // }else{
                    // res.status(200).json(book);
                // }
            // });
        // }else{
            // res.status(400).json({ message: "Se necesita un ID de libro válido"})
        // }
    // } catch (error) {
        // res.status(500).json({ message: "Error de conexión al seridor" })
    // }
// }

exports.addBook = async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id).exec();
    let book = await Book.findOne({ bookISBN: req.body.bookISBN });
    try {
        if (book === null) {
            book = new Book({
            bookName: req.body.bookName,
            bookAuthor: req.body.bookAuthor,
            bookEditorial: req.body.bookEditorial,
            bookPages: req.body.bookPages,
            bookClasification: req.body.bookClasification,
            bookISBN: req.body.bookISBN,
            bookDescription: req.body.bookDescription,
            });
            await book.save();
        }
        user.books.push(book._id);
        const updateResult = await user.save();
        console.log("libros de usuario en addBook: ", user.books);
        if (updateResult) {
          res.status(200).send({ books: user.books });
        } else {
          res.status(404).send({ message: "Error al insertar el libro en el usuario" });
        }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  };

exports.deleteBook = async (req, res) => {
  const id = req.params.id;
  console.log("id en deleteBook: ", id);
  const bookISBN = req.body.bookISBN;
  console.log("bookISBN en deleteBook: ",bookISBN);
  console.log("req.body en deleteBook: ",req.body.bookISBN);

  try {
    const book = await Book.findOne({ bookISBN: bookISBN });
    console.log("Libro en deleteBook: ", book);
    if (!book) {
      return res.status(404).json({ message: 'El libro no fue encontrado.' });
    }

    const bookId = book._id.toString();

    const user = await User.findByIdAndUpdate(
      id,
      { $pull: { books: bookId } },
      { new: true }
    ).populate("books")
    .exec();
    console.log("usuario en deleteBook: ", user)

    if (!user) {
      return res.status(401).json({ message: 'El usuario no fue encontrado.' });
    }

    res.status(200).json({ books: user.books });
  } catch (error) {
    console.error("Error en el servidor: ", error);
    res.status(500).json({ message: "Error de conexión al servidor." });
  }
};