"use strict";
const userModel = require("../../models/user.models");
const bcrypt = require("bcrypt-nodejs");

exports.getUsers = async (req, res) => {
  await userModel.find((err, docs) => {
    err
      ? res.send(500).send({ status: "error on get the users" })
      : !docs
      ? res.status(500).send({ status: "error con get the users in db" })
      : res.status(200).send(docs);
  });
};
exports.createAdmin = async (userName, password, rol) => {
  let user = new userModel();
  if (userName && password && rol) {
    user.userName = userName;
    user.password = password;
    user.rol = rol;
    user.password = await encryptPassword(password);
    userModel
      .find({
        $or: [{ userName: user.userName, rol: user.rol }],
      })
      .exec((err, recordsFound) => {
        if (err) {
          console.log({ status: "Error on get the user" });
        }
        if (recordsFound && recordsFound.length >= 1) {
          console.log({ status: "User already exists in Data Base" });
        } else {
          user.save((err, document) => {
            if (err) {
              console.log({ status: "error on saving the user" });
            } else {
              console.log([{ status: "user saved" }, { userInfo: document }]);
            }
          });
        }
      });
  } else {
    console.log({ status: "missing some parameters" });
  }
};

const encryptPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, null, null, (errors, passwordEncrypted) => {
      if (errors) {
        reject(new Error("Some error ocurrss encrypting the password"));
      } else {
        resolve(passwordEncrypted);
      }
    });
  });
};
