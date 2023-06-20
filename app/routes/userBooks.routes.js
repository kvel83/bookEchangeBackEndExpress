const { authJwt } = require("../middlewares");
const controller = require("../controllers/userBooks.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/userBook/getAllBooks/:id",
    [
        authJwt.verifyToken
    ],
    controller.getAllBooksByUser
  );

  app.get(
    "/api/userBook/getBookById/:id",
    [
        authJwt.verifyToken
    ],
    controller.getBookById
  );

  app.post("/api/userBook/addBook/:id",
  [
    authJwt.verifyToken
  ],
  controller.addBook);

  app.delete("/api/userBook/deleteBook/:id",
  [
    authJwt.verifyToken
  ],
  controller.deleteBook);
};