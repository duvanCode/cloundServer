const express = require('express');
const auth = require('../middlewares/auth.middleware.js');
const corsAuth = require('../middlewares/corsAuth.middleware.js');
const { registerUser, loginUser} = require('../controllers/register.controller.js');
const { getFile,getFileInfo, createFile } = require('../controllers/file.controller.js');
const { homeController } = require('../controllers/home.controller.js');
const contentSecurityPolicy = require('../middlewares/contentSecurityPolicy.middleware.js');
var app = express();

const SERVER_TIMEOUT = process.env.SERVER_TIMEOUT || (10 * 60 * 1000); // Default 10 min
const BODY_LIMIT = process.env.BODY_PARSER_LIMIT || '1024mb';
const REQUEST_TIMEOUT = process.env.REQUEST_TIMEOUT || (10 * 60 * 1000);

app.use(contentSecurityPolicy);
app.use(corsAuth);

app.use(express.json({ 
    limit: BODY_LIMIT,
    timeout: REQUEST_TIMEOUT 
}));

app.use(express.urlencoded({ 
    limit: BODY_LIMIT, 
    extended: true,
    timeout: REQUEST_TIMEOUT 
}));

app.post('/createFile', auth, createFile);
app.get('/getFile/:id', getFile);
app.get('/getFileInfo/:id',auth, getFileInfo);
app.post('/register', registerUser);
app.post('/login', loginUser);
app.get('/',homeController);

module.exports = app;
