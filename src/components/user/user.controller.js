"use strict";
const companyModel = require('../../models/company.models')
const objectID = require("mongodb").ObjectID;
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
exports.createUser = async (req, res) => {
  let user = new userModel();
  const {userName, password, rol, company} = req.body;
  if (userName && password && rol && company) {
    user.userName = userName;
    user.password = password;
    user.rol = rol;
    user.company = company;
    await companyModel.findOne({ "_id": objectID(company.toString()) }, (err, companyInfo) => {
      if(err){console.log(err)}
      if(companyInfo){
        userModel.find(
              {
                $or: [
                  {
                    userName: user.userName,
                    rol: user.rol,
                    company: user.company,
                  },
                ],
              },
              (err, document) => {
                if (err) {
                  res.status(500).send({ status: "error getting user from db" });
                } else if (document && document.length >= 1) {
                  console.log(document);
                  res.status(500).send({ status: "user already exists in db" });
                } else {
                  // user with nombre de empresa
                  user.company = [companyInfo]
                  // Quitar si no se necesita en modelo quitar y poner Schema.ObjectId
                  user.save((err, document) => {
                    if (err) {
                      console.log(err);
                      res.status(500).send({ status: "Error saving user check the paramaters" });
                    } else {
                      res.status(200).send([{ status: "OK" }, { user: document }]);
                    }
                  });
                }
              }
            );
      }else{
        res.status(404).send({"status": "Company not found"})
      }
    });
    
  } else {
    res.status(500).send({ status: "missing some parameters" });
  }
};
exports.createAdmin = async (userName, password, rol) => {
  let user = new userModel();
  if (userName && password && rol) {
    user.userName = userName;
    user.password = password;
    user.rol = rol;
    user.password = await encryptPassword(password)
    userModel
      .find({
        $or: [
          { userName: user.userName,
            rol: user.rol },
        ],
      })
      .exec((err, recordsFound) => {
        if(err){
          console.log({ status: "Error on get the user" });  
        }
        if(recordsFound && recordsFound.length >= 1){
          console.log({ status: "User already exists in Data Base" });
        }else{
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
