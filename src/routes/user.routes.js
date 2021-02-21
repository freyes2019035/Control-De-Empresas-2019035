'use strict' 
const express = require('express');
const router = express.Router();
const adminController = require('../components/user/user.controller')

router.get('/', adminController.getUsers)
module.exports = router;