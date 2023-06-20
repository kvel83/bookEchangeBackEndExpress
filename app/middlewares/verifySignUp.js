const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUsername = (req, res, next) => {
  User.findOne({ userName: req.body.userName })
    .exec()
    .then((user) => {
      if (user) {
        return res.status(400).send({ message: "Failed! Username is already in use!" });
      }
      next();
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};


const checkRolesExisted = (req, res, next) => {
  if(!(req.body.role && ROLES.includes(req.body.role))){
    res.status(400).send({
      message:`Failed! Role ${req.body.role} does not exist!`
     });
  }
  next();
};

const verifySignUp = {
    checkDuplicateUsername,
    checkRolesExisted
};

module.exports = verifySignUp;