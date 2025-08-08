const express = require('express');
const auth = require('../middlewares/auth.middleware.js');
const corsAuth = require('../middlewares/corsAuth.middleware.js');
const { registerUser, loginUser} = require('../controllers/register.controller.js');
const { getFile,getFileInfo, createFile } = require('../controllers/file.controller.js');
const { homeController } = require('../controllers/home.controller.js');

var app = express();

app.use(corsAuth);
app.use(express.json());
app.post('/createFile', auth, createFile);
app.get('/getFile/:id', getFile);
app.get('/getFileInfo/:id',auth, getFileInfo);
app.post('/register', registerUser);
app.post('/login', loginUser);
app.get('/',homeController);
module.exports = app;
