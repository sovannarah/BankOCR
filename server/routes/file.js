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
        const newFilename = files.file.newFilename;
        let newPath = `./${newFilename}.txt`;
        mv(oldPath, newPath, {mkdirp: true}, err => {
            if (!err) {
                fs.readFile(newPath, 'utf8', (err, data) => {
                    if (err) {
                        console.error(err);
                    }
                    scansFile(data, newFilename)
                        .then((result) => {
                            res.send({data: result, filename: newFilename})
                        })
                        .catch(err => res.status(500).send(err))
                })
            }
        })
    })
})

router.get("/download/:filename", async (req, res) => {
    res.download(`./${req.params.filename}.txt`)
})

module.exports = router;



