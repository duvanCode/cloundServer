const express = require('express');
const auth = require('../middlewares/auth.middleware.js');
const { getFile, getFileInfo, createFile } = require('../controllers/file.controller.js');
const router = express.Router();

router.post('/createFile', auth, createFile);
router.get('/getFile/:id', getFile);
router.get('/getFileInfo/:id', auth, getFileInfo);

module.exports = router;