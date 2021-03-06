'use strict' 
const express = require('express');
const router = express.Router();
const companyController = require('../components/company/company.controller')
const auth_middleWare = require('../middlewares/auth.middleware');

router.get('/', companyController.getCompanies)
router.get('/personal',auth_middleWare.ensureAuth,companyController.getPersonal)
router.post('/', auth_middleWare.ensureAuth, companyController.createCompany)
router.put('/:id', auth_middleWare.ensureAuth, companyController.updateCompany)
router.delete('/:id', auth_middleWare.ensureAuth, companyController.deleteCompany)
router.get('/generate/pdf',auth_middleWare.ensureAuth,companyController.createPDF)
router.get('/generate/xlsx',auth_middleWare.ensureAuth,companyController.createXLSX)
module.exports = router;