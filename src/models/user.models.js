const mongoose = require('mongoose')
const objectId = require('mongoose').objectId
let schema = mongoose.Schema;

let userSchema =  schema({
    userName: String,
    password: String, 
    rol: String,
    company: {type: schema.ObjectId, ref: "empresas"},
});

module.exports =  mongoose.model('usuarios', userSchema);