'use strict'
const bcrypt = require('bcrypt-nodejs')
const companyModel = require("../../models/company.models");
const employeeModel = require("../../models/employee.models");
const userModel = require('../../models/user.models')
const ObjectID = require("mongodb").ObjectID;
const pdfGenerator = require('../../utils/pdf/pdf.generator')
const xlsxGenerator = require('../../utils/xlsx/xlsx.generator')
exports.getCompanies = async (req, res) => {
  await companyModel.find((err, docs) => {
    err
      ? res.send(500).send({ status: "error on get the comapines" })
      : !docs
      ? res.status(500).send({ status: "error con get the companies in db" })
      : res.status(200).send(docs);
  });
};
exports.getPersonal = async (req, res) => {
  const id = req.user.company;
  await employeeModel.countDocuments(
    { company: ObjectID(id) },
    (err, number) => {
      if (err) {
        return res.status(500).send("Error on get the employees");
      }
      res.status(200).send([
        {
          status: "OK",
        },
        { "Number of employees": number },
      ]);
    }
  );
};
exports.createCompany = async (req, res) => {
  if (req.user.rol === "admin") {
    let company = new companyModel();
    let user = new userModel();
    const { name, userName, password } = req.body;
    console.log(name);
    if (name, userName, password) {
      user.password = await encryptPassword(password);
      company.name = name;
      user.userName = userName;
      user.rol = "user";
      await userModel.find({userName: userName, rol: user.rol}, (err, userFind) => {
        if(err){
          console.log(err);
        }else if(userFind && userFind.length >= 1){
          res.status(500).send({status: 'User Name already exists'})
        }else{
          companyModel.find({$or: [{ name: company.name }]}, (err, companyFind) => {
            if (err) {
              res.status(500).send({ status: "error on create the company" });
            } else if (companyFind && companyFind.length >= 1) {
              res.status(500).send({ status: "Company already exists in DB" });
            } else {
              company.save((err, company) => {
                if(err){
                  console.log(err)
                }else {
                  user.company = company._id;
                  user.save((err, user) => {
                    res.status(200).send({
                      company: company,
                      user: user
                    })
                  })
                }
              })
            }
          })
        }
      })









    } else {
      res.status(500).send({ status: "missing some parameters" });
    }
  } else {
    res.status(401).send({ status: "Access denied insufficient permissions" });
  }
};
exports.updateCompany = (req, res) => {
  if(req.user.rol === "admin"){
    const { id } = req.params;
    const { name } = req.body;
    if (name) {
      companyModel.findByIdAndUpdate(
        { _id: ObjectID(id.toString()) },
        { $set: { name: name } },
        {new: true},
        (err, resp) => {
          err
            ? res.status(500).send({ status: "error on update company" })
            : res.status(200).send([{ status: "OK" }, { companyUpdated: resp }]);
        }
      );
    } else {
      res.status(500).send({ status: "missing some parameters" });
    }
  }else{
    res.status(401).send({ status: "Access denied insufficient permissions" });
  }

};
exports.deleteCompany = async (req, res) => {
  if(req.user.rol === "admin"){
    const { id } = req.params;
    await companyModel.findByIdAndRemove(
      { _id: ObjectID(id.toString()) },
      (error, response) => {
        error
          ? res.status(500).send({ status: "error deleting company" })
          : res.status(200).send([{ status: "OK" }, { deleted: response }]);
      }
    );
  }else{
    res.status(401).send({ status: "Access denied insufficient permissions" });
  }
};

exports.createPDF = async (req, res) => {
  console.log(req.user)
  let obj = [];
  const companyId = req.user.company;
  await employeeModel.find({"company": ObjectID(companyId)}, (err, documents) => {
    if(err){
      res.status(500).send({"status": "error on get the company employees"})
    }else if(documents && documents.length >= 1){
      obj = documents;
    }else{
      res.status(500).send({"status": "Jmmm you dont have any employee registered"})
    }
  });
  await pdfGenerator.generatePDF(obj).then(data => res.download(data.filename))
}
exports.createXLSX = async (req, res) => {
  let obj = [];
  const companyId = req.user.company;
  await employeeModel.find({"company": ObjectID(companyId)}, (err, documents) => {
    if(err){
      res.status(500).send({"status": "error on get the company employees"})
    }else if(documents && documents.length >= 1){
      obj = documents;
    }else{
      res.status(500).send({"status": "Jmmm you dont have any employee registered"})
    }
  });
  await xlsxGenerator.generateXLSX(obj).then(data => {
    res.download(data)
  })
}
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