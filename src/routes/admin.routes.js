'use strict' 
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send({"status": "get all the admins"})
})
router.post('/', (req, res) => {
    res.send({"status": "post a admin"})
})
router.put('/', (req, res) => {
    res.send({"status": "put a admin"})
})
router.delete('/', (req, res) => {
    res.send({"status": "delete a admin"})
})

module.exports = router;