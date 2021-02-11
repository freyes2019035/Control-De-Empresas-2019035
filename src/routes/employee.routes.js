'use strict' 
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send({"status": "get all the employees"})
})
router.post('/', (req, res) => {
    res.send({"status": "post a employee"})
})
router.put('/', (req, res) => {
    res.send({"status": "put a employee"})
})
router.delete('/', (req, res) => {
    res.send({"status": "delete a employee"})
})

module.exports = router;