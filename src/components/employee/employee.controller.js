'use strict'
const objectID = require("mongodb").ObjectID;
const employeeModel = require("../../models/employee.models");
const companyModel = require("../../models/company.models");
// Search 
exports.getEmployees = async (req, res) => {
    const companyId = req.user.company;
    await employeeModel.find({"company": objectID(companyId)}, (err, documents) => {
      if(err){
        res.status(500).send({"status": "error on get the company employees"})
      }else if(documents && documents.length >= 1){
        res.send(documents)
      }
    });
};
exports.getEmployee = async (req, res) => {
  const { id } = req.params;
  await employeeModel.findById({ _id: objectID(id.toString()) }, (err, document) => {
    if(err){
      res.status(500).send({ status: "error getting the employee" })
    }else if(document.company.toString() === req.user.company.toString()){
      res.send([{"status": "OK"}, {"employee": document}])
    }else{
      res.status(401).send({"status": "Warning !! You cannot list a employee who are not from your company"})
    }
  });
};
exports.getEmployeeByName = async (req, res) => {
  const { name } = req.params;
  await employeeModel.find({ "name": {$regex: name.toString(), $options: 'i'}, "company": objectID(req.user.company)}, (err, document) => {
    if(err){
      res.status(500).send({ status: "error getting the employee" })
    }else if(document && document.length >= 1){
        res.status(200).send(document)
    }else{
      res.status(401).send({"status": "Warning !! You cannot list a employee who are not from your company"})
    }
  });
};
exports.getEmployeeByPosition = async (req, res) => {
  const { position } = req.params;
  await employeeModel.find({ "position": {$regex: position.toString(), $options: 'i'}, "company": objectID(req.user.company)}, (err, document) => {
    if(err){
      res.status(500).send({ status: "error getting the employee" })
    }else if(document && document.length >= 1){
      res.status(200).send(document);
    }else{
      res.status(401).send({"status": "Warning !! You cannot list employees who are not from your company"})
    }
  });
};
exports.getEmployeeByDepartament = async (req, res) => {
  const { departament } = req.params;
  await employeeModel.find({ "departament": {$regex: departament.toString(), $options: 'i'},  "company": objectID(req.user.company)}, (err, document) => {
    if(err){
      res.status(500).send({ status: "error getting the employee" })
    }else if(document && document.length >= 1){
      res.status(200).send(document);
    }else{
      res.status(401).send({"status": "Warning !! You cannot list employees who are not from your company"})
    }
    
  });
};

// CRU
exports.createEmployee = async (req, res) => {
  let employee = new employeeModel();
  const { name, position, departament, company } = req.body;
  if(req.user.company === company){
    if (name && position && departament && company) {
      employee.name = name;
      employee.position = position;
      employee.departament = departament;
      employee.company = company;
      await companyModel.findOne({ "_id": objectID(company.toString()) }, (err, companyInfo) => {
        if(err){console.log(err)}
        if(companyInfo){
          employeeModel.find(
                {
                  $or: [
                    {
                      name: employee.name,
                      position: employee.position,
                      departament: employee.departament,
                      company: employee.company,
                    },
                  ],
                },
                (err, document) => {
                  if (err) {
                    res.status(500).send({ status: "error getting employee from db" });
                  } else if (document && document.length >= 1) {
                    console.log(document);
                    res.status(500).send({ status: "employee already exists in db" });
                  } else {
                    // Employee with nombre de empresa
                     // employee.company = [companyInfo]
                    // Quitar si no se necesita en modelo quitar y poner Schema.ObjectId
                    employee.save((err, document) => {
                      if (err) {
                        console.log(err);
                        res.status(500).send({ status: "Error saving employee check the paramaters" });
                      } else {
                        res.status(200).send([{ status: "OK" }, { employee: document }]);
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
  }else{
    res.status(401).send({"status": "Warning !! You cannot add employees who are not from your company"})
  }
};
exports.updateEmployee = (req, res) => {
  const { id } = req.params;
  const { name, position, departament, company } = req.body;
  console.log(name, position, departament, company);
  if(req.user.company === company){
    employeeModel.findOneAndUpdate(
      { _id: objectID(id.toString()) },
      {
        $set: {
          name: name,
          position: position,
          departament: departament,
          company: company,
        },
      },
      {new: true},
      (err, resp) => {
        err
          ? res.status(500).send({ status: "error on update employee" })
          : res.status(200).send([{ status: "OK" }, { employeeUpdated: resp }]);
      }
    );
  }else{
    res.status(401).send({"status": "Warning !! You cannot update employees who are not from your company"})
  }
};
exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  await employeeModel.find({_id: objectID(id)},(err,document) => {
    if(err){
      res.status(500).send({"status": "error on get the employee"})
    }else if(document && document.length >= 1){
      if(req.user.company === document[0].company.toString()){
        employeeModel.findByIdAndRemove(
            { _id: objectID(id.toString()) },
            (err, resp) => {
              if (err) {
                res.status(500).send({ status: "error on remove employee" });
              } else {
                res.status(200).send([{ status: "OK" }, { employeeRemoved: resp }]);
              }
            }
          );
      }else{
        res.status(401).send({"Status": "Warning !! You cannot remove employees who are not from your company"});
      }
    }else{
      console.log(document.length)
      res.status(500).send({"status": "Employee doesn't exists in our records"})
    }
  })
  // await employeeModel.findOneAndRemove(
  //   { _id: objectID(id.toString()) },
  //   (err, resp) => {
  //     if (err) {
  //       res.status(500).send({ status: "error on remove employee" });
  //     } else {
  //       res.status(200).send([{ status: "OK" }, { updatedEmployee: resp }]);
  //     }
  //   }
  // );
};