'use strict'
const objectID = require("mongodb").ObjectID;
const employeeModel = require("../../models/employee.models");
const companyModel = require("../../models/company.models");
// Search 
exports.getEmployees = async (req, res) => {
    const companyId = req.user.company;
    if(companyId){
      await employeeModel.find({"company": objectID(companyId)}, (err, documents) => {
        if(err){
          res.status(500).send({"status": "error on get the company employees"})
        }else if(documents && documents.length >= 1){
          res.send(documents)
        }
      });
    }else{
      res.status(401).send({"status": "Warning !! We can't get the company in your token"})
    }
};
exports.getEmployee = async (req, res) => {
  const { id } = req.params;
  if(req.user.company){
    await employeeModel.findById({ _id: objectID(id.toString())}, (err, document) => {
      if(err){
        res.status(500).send({ status: "error getting the employee" })
      }else if(document.company.toString() === req.user.company.toString()){
        res.send([{"status": "OK"}, {"employee": document}])
      }else{
        res.status(401).send({"status": "Warning !! You cannot list a employee who are not from your company"})
      }
    });
  }else{
    res.status(401).send({"status": "Warning !! We can't get the company in your token"})
  }
};
exports.getEmployeeByName = async (req, res) => {
  const { name } = req.params;
  if(req.user.company){
    await employeeModel.find({ "name": {$regex: name.toString(), $options: 'i'}, "company": objectID(req.user.company)}, (err, document) => {
      if(err){
        res.status(500).send({ status: "error getting the employee" })
      }else if(document && document.length >= 1){
          res.status(200).send(document)
      }else{
        res.status(401).send({"status": "Warning !! You cannot list a employee who are not from your company"})
      }
    });
  }else{
    res.status(401).send({"status": "Warning !! We can't get the company in your token"})
  }
};
exports.getEmployeeByPosition = async (req, res) => {
  const { position } = req.params;
  if(req.user.company){
    await employeeModel.find({ "position": {$regex: position.toString(), $options: 'i'}, "company": objectID(req.user.company)}, (err, document) => {
      if(err){
        res.status(500).send({ status: "error getting the employee" })
      }else if(document && document.length >= 1){
        res.status(200).send(document);
      }else{
        res.status(401).send({"status": "Warning !! You cannot list employees who are not from your company"})
      }
    }); 
  }else{
    res.status(401).send({"status": "Warning !! We can't get the company in your token"})
  }
};
exports.getEmployeeByDepartament = async (req, res) => {
  const { departament } = req.params;
  if(req.user.company){
    await employeeModel.find({ "departament": {$regex: departament.toString(), $options: 'i'},  "company": objectID(req.user.company)}, (err, document) => {
      if(err){
        res.status(500).send({ status: "error getting the employee" })
      }else if(document && document.length >= 1){
        res.status(200).send(document);
      }else{
        res.status(401).send({"status": "Warning !! You cannot list employees who are not from your company"})
      }
    });
  }else{
    res.status(401).send({"status": "Warning !! We can't get the company in your token"})
  }
};

// CRU
exports.createEmployee = async (req, res) => {
  let employee = new employeeModel();
  const { name, position, departament } = req.body;
  if(req.user.company){
    if (name && position && departament) {
      employee.name = name;
      employee.position = position;
      employee.departament = departament;
      employee.company = req.user.company;
      await companyModel.findOne({ "_id": objectID(req.user.company.toString()) }, (err, companyInfo) => {
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
    res.status(401).send({"status": "Jmmmm... We can't detect the company in your user, try later"})
  }
};
exports.updateEmployee = (req, res) => {
  const { id } = req.params;
  const { name, position, departament } = req.body;
  if(req.user.company){
    employeeModel.findOneAndUpdate(
      { _id: objectID(id.toString()), company: req.user.company },
      {
        $set: {
          name: name,
          position: position,
          departament: departament,
          company: req.user.company,
        },
      },
      {new: true},
      (err, resp) => {
        if(err){
          res.status(500).send({ status: "Warning !! Error on update employee" });
        }else if(resp){
          res.status(200).send([{ status: "OK" }, { employeeUpdated: resp }]);
        }else{
          res.status(500).send([{ status: "Jmmmmm... We can't find that employee in your company" }]);
        }
      }
    );
  }else{
    res.status(401).send({"status": "Jmmmm... We can't detect the company in your user, try later"})
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
};