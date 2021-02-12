const mongoose = require('mongoose');
const schema = mongoose.Schema;


let employeeSchema = {
    name: String,
    position: String,
    departament: String,
    companyName: String,
}

module.exports = mongoose.model('empleados', employeeSchema)