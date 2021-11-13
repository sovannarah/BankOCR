const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const fileRouter = require('./routes/file');

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/file', fileRouter);


module.exports = app;
