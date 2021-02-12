const companyModel = require("../../models/company.models")
const ObjectID = require('mongodb').ObjectID;

exports.getCompanies = async (req, res) => {
  await companyModel.find((err, docs) => {
    err
    ? res.send(500).send({ status: "error on get the comapines" })
    : !docs
    ? res.status(500).send({ status: "error con get the companies in db" })
    : res.status(200).send(docs);
  })
}
exports.createCompany = (req, res) => {
    let company = new companyModel();
    const { name } = req.body;
    if(name){
      company.name = name;
      companyModel
      .find({
        $or: [
          { companyName: company.name },
        ],
      }).exec((err, documents) => {
        if(err){
          res.status(500).status({"status": "error on create the company"})
        }else if(documents && documents.length >= 1){
          res.status(500).status({"status": "Company already exists in DB"})
        }else{
          company.save((err, document) => {
            if(err){
              res.status(500).send({"status": "error on save the company"})
            }else{
              res.status(200).send([{"status": "OK"}, {"companyInfo": document}])
            }
          })
        }
      })
    }else{
      res.status(500).send({"status": "missing some parameters"})
    }
}
exports.updateCompany = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  console.log(name)
  companyModel.findByIdAndUpdate({"_id": ObjectID(id.toString())}, {$set: {"name": name}}, (err, resp) => {
    (err) 
     ?
     res.status(500).send({"status": "error on update company"}) 
     :
     res.status(200).send([{"status": "OK"}, {"companyUpdated": resp}])
  })
}
exports.deleteCompany = async (req, res) => {
  const { id } = req.params;
  await companyModel.findByIdAndRemove({"_id": ObjectID(id.toString())}, (error, response) => {
    (error) 
      ? 
      res.status(500).send({"status": "error deleting company"}) 
      : 
      res.status(200).send([{"status": "OK"}, {"response": response}])
  })

}