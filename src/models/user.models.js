const mongoose = require('mongoose')
const objectId = require('mongoose').objectId
let schema = mongoose.Schema;

let userSchema =  {
    userName: String,
    password: String, 
    rol: String,
    company: {type: Object, ref: "empresas"},
}

module.exports =  mongoose.model('usuarios', userSchema);