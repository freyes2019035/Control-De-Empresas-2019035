'use strict'
const mongoose = require('mongoose');
let schema = mongoose.Schema;

let companySchema = schema({
    name: String
})

module.exports = mongoose.model('empresas',companySchema)