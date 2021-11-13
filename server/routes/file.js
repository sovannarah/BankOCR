const express = require('express');
const router = express.Router();
const fs = require('fs');
const mv = require('mv')
const formidable = require('formidable');
const {scansFile} = require('../utils/scans');

router.post('/read', async (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        let oldPath = files.file.filepath;
        let newPath = './numbers.txt';
        if (fs.existsSync(newPath)) {
            fs.unlink(newPath, err => {
                if (err) throw err;
            });
        }
        mv(oldPath, newPath, {mkdirp: true}, err => {
            if (!err) {
                fs.readFile(newPath, 'utf8', (err, data) => {
                    if (err) {
                        console.error(err);
                    }
                    scansFile(data)
                        .then(() => res.download('./numbersAccounts.txt'))
                        .catch(err => res.send({status: 500, message: err}))
                })
            }
        })
    })
})

router.get("/test", async (req, res) => {
    res.download('./numbers.txt')
})

module.exports = router;



