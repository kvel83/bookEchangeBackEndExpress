require('dotenv').config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express"),
swaggerDocument = require("./swagger.json");

const app = express();

app.use(express.json());

const db = require('./app/models');
const Role = db.role;

let corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Si esta recibiendo la petición, bienvenido al backend de book exchange" });
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/userBooks.routes')(app);

const PORT = 3500;

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

if (process.env.NODE_ENV !== 'test') {
  db.mongoose
    .connect(`mongodb://${process.env.HOST}:${process.env.PORT}/${process.env.DB}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log("Successfully connect to MongoDB.");
      initial();
    })
    .catch(err => {
      console.error("Connection error", err);
    });
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
};


async function initial() {
  try {
    const count = await Role.estimatedDocumentCount();
    if (count === 0) {
      await Promise.all([
        new Role({
          name: "user",
          type: '2'
        }).save(),
        new Role({
          name: "admin",
          type: '1'
        }).save()
      ]);
      console.log("Added 'user' and 'admin' to roles collection");
    }
  } catch (err) {
    console.error("Error initializing roles", err);
  }
};

app.initial = initial;

module.exports = app;