'use strict' 
const express = require('express');
const router = express.Router();
const md = require('../middlewares/auth.middleware')
const adminController = require('../components/user/user.controller')

router.get('/', adminController.getUsers)
router.post('/', adminController.createUser)

module.exports = router;