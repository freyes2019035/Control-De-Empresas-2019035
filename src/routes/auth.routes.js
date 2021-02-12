'use strict' 
const express = require('express');
const router = express.Router();
const authController = require('../components/auth/auth.controller')

router.get('/login', authController.login)

module.exports = router;