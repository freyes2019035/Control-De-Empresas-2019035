const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let employeeSchema = Schema({
    name: String,
    position: String,
    departament: String,
    company: {type: Schema.ObjectId, ref: "empresas"},
});

module.exports = mongoose.model('empleados', employeeSchema)