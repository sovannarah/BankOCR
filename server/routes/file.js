const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/read', async (req, res, next) => {
    fs.readFile('./numbers.txt', 'utf8' , (err, data) => {
        if (err) {
            console.error(err)
        }
        console.log(data)

    })
})

module.exports = router;



