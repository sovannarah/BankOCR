const express = require('express');
const router = express.Router();
const fs = require('fs');
const {scansFile} = require('../utils/scans');

router.get('/read', async (req, res, next) => {
    fs.readFile('./numbers.txt', 'utf8' , (err, data) => {
        if (err) {
            console.error(err);
        }
        res.send(scansFile(data));
    })
})

module.exports = router;



