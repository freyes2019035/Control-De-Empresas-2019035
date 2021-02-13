const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let employeeSchema = {
    name: String,
    position: String,
    departament: String,
    company: {type: Object, ref: "empresas"},
}

module.exports = mongoose.model('empleados', employeeSchema)