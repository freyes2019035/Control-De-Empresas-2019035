const mongoose = require('mongoose');
let schema = mongoose.Schema;

let companySchema = schema({
    id: String,
    name: String
})

module.exports = mongoose.model('empresas',companySchema)