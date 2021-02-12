const mongoose = require('mongoose')
let schema = mongoose.Schema;

let userSchema =  {
    userName: String,
    password: String, 
    rol: String
}

module.exports =  mongoose.model('usuarios', userSchema);