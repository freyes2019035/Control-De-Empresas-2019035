'use strict' 
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send({"status": "get all the companies"})
})
router.post('/', (req, res) => {
    res.send({"status": "post a companie"})
})
router.put('/', (req, res) => {
    res.send({"status": "put a companie"})
})
router.delete('/', (req, res) => {
    res.send({"status": "delete a companie"})
})

module.exports = router;