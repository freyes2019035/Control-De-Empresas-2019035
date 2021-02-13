'use strict' 
const express = require('express');
const router = express.Router();
const companyController = require('../components/company/company.controller')
const auth_middleWare = require('../middlewares/auth.middleware');

router.get('/', companyController.getCompanies)
router.post('/', auth_middleWare.ensureAuth, companyController.createCompany)
router.put('/:id', auth_middleWare.ensureAuth, companyController.updateCompany)
router.delete('/:id', auth_middleWare.ensureAuth, companyController.deleteCompany)

module.exports = router;