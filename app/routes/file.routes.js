const express = require('express');
const auth = require('../middlewares/auth.middleware.js');
const registerUser = require('../controllers/register.controller.js');
const { getFile, createFile } = require('../controllers/file.controller.js');


var app = express();

app.use(express.json());
app.post('/createFile', auth, createFile);
app.get('/getFile/:id', getFile);
app.post('/register', registerUser);

module.exports = app;