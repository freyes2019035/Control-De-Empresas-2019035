'use strict' 
const express = require('express');
const router = express.Router();
const companyController = require('../components/company/company.controller')

router.get('/', companyController.getCompanies)
router.post('/', companyController.createCompany)
router.put('/:id', companyController.updateCompany)
router.delete('/:id', companyController.deleteCompany)

module.exports = router;