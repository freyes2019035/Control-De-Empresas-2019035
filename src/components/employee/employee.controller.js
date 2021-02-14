const objectID = require("mongodb").ObjectID;
const employeeModel = require("../../models/employee.models");
const companyModel = require("../../models/company.models");
exports.getEmployees = (req, res) => {
  employeeModel.find((err, documents) => {
    if (err) {
      res.status(500).send({ status: "error getting employees" });
    } else {
      res.status(200).send(documents);
    }
  });
};
exports.getEmployee = (req, res) => {
  const { id } = req.params;
  employeeModel.findOne({ _id: objectID(id.toString()) }, (err, resp) => {
    err
      ? res.status(500).send({ status: "error getting the employee" })
      : res.status(200).send(resp);
  });
};
exports.getEmployeeByName = (req, res) => {
  const { name } = req.params;
  employeeModel.findOne({ "name": name.toString()}, (err, resp) => {
    err
      ? res.status(500).send({ status: "error getting the employee" })
      : res.status(200).send(resp);
  });
};
exports.getEmployeeByPosition = (req, res) => {
  const { position } = req.params;
  employeeModel.findOne({ "position": position.toString()}, (err, resp) => {
    err
      ? res.status(500).send({ status: "error getting the employee" })
      : res.status(200).send(resp);
  });
};
exports.getEmployeeByDepartament = (req, res) => {
  const { departament } = req.params;
  employeeModel.findOne({ "departament": departament.toString()}, (err, resp) => {
    err
      ? res.status(500).send({ status: "error getting the employee" })
      : res.status(200).send(resp);
  });
};
exports.createEmployee = async (req, res) => {
  let employee = new employeeModel();
  const { name, position, departament, company } = req.body;
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
                  employee.company = [companyInfo]
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
};

exports.updateEmployee = (req, res) => {
  const { id } = req.params;
  const { name, position, departament, company } = req.body;
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
    (err, resp) => {
      err
        ? res.status(500).send({ status: "error on update employee" })
        : res.status(200).send([{ status: "OK" }, { employeeUpdated: resp }]);
    }
  );
};

exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  await employeeModel.findOneAndRemove(
    { _id: objectID(id.toString()) },
    (err, resp) => {
      if (err) {
        res.status(500).send({ status: "error on remove employee" });
      } else {
        res.status(200).send([{ status: "OK" }, { updatedEmployee: resp }]);
      }
    }
  );
};


exports.example = (req, res) => {
  // res.send({"company": req.user.company[0]["_id"]})
  res.send(req.user.rol)
}
