require('dotenv').config();
// const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

exports.signup = async(req, res) => {
    try {
        console.log("peticion a signup: ",req);
        let roleName;
        if(req.body.role === 1){
            roleName = 'admin';
        }else if(req.body.role === 2){
            roleName = 'user';
        }else{
            return res.status(400).send({message: "Invalid role type"});
        };
        const role = await Role.findOne({name: roleName});
        if (!role){
            return res.status(500).send({message: "Role ${roleName} not found"});
        };
        const user = new User({
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            userPassword: bcrypt.hashSync(req.body.userPassword, 8),
            userAge: req.body.userAge,
            role: req.body.role
          });
          console.log("usuario a registrar: ", user);
          await user.save();
          res.status(200).send(user);
    } catch (error) {
        return res.status(500).send({message: error.message});
    }
  };

  exports.signin = async (req, res) => {
    try {
        console.log("userName en signin: ", req.body.userName);
        const user = await User.findOne({ userName: req.body.userName }).exec();
        console.log("usuario en signin: ", user);

        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }

        const passwordIsValid = bcrypt.compareSync(req.body.userPassword, user.userPassword);

        if (!passwordIsValid) {
            return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
            });
        }

      const role = await Role.findOne({ type: user.role }).exec();

      if (!role) {
        return res.status(404).send({ message: "Role Not found." });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 86400 });

      const roleData = role.toObject(); // Realizar una copia superficial del objeto role

      res.status(200).json({
        id: user._id,
        userName: user.userName,
        userEmail: user.userEmail,
        userAge: user.userAge,
        role: roleData, // Enviar la copia del objeto role
        accessToken: token
      });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };
