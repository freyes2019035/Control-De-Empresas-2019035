'use strict' 
const express = require('express');
const router = express.Router();
const employeeController = require('../components/employee/employee.controller')

router.get('/', employeeController.getEmployees)
router.get('/:id', employeeController.getEmployee)
router.get('/name/:name', employeeController.getEmployeeByName)
router.get('/position/:position', employeeController.getEmployeeByPosition)
router.get('/departament/:departament', employeeController.getEmployeeByDepartament)
router.post('/',employeeController.createEmployee)
router.put('/:id', employeeController.updateEmployee)
router.delete('/:id', employeeController.deleteEmployee)

module.exports = router;