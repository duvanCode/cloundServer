const express = require('express');
const Joi = require('joi');
const auth = require('../controllers/auth.controller.js');
const singIn = require('../controllers/singIn.controller.js');
const { getFile, setFile } = require('../controllers/file.controller.js');
const axios = require('axios');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


var app = express();

app.post('/createFile', auth, async (req, res) => {
  try {
    const validate = Joi.object({
      file: Joi.binary().required()
    });

    const { error } = validate.validate(req.body);

    if (error) return res.status(400).json({ error: error.details[0].message });

    const uploadSingle = upload.single('file');

    uploadSingle(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      const serverUrl = `${req.protocol}://${req.get('host')}`;
      const userId = req.userId;
      let result = await setFile(req.file, userId, serverUrl);

      res.json(result);
    });

  } catch (error) {
    res.status(400).json({ message: 'missed file' });
    console.log();
  }
});

app.get('/getFile/:id', async (req, res) => {
  try {

    const fileId = req.params.id;
    let url = await getFile(fileId);

    if (!url) {
      res.status(404).json({ message: 'Not found' });
      return
    }

    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    });
    res.set('Content-Disposition', response.headers['content-disposition']);
    res.set('Content-Type', response.headers['content-type']);
    res.set('Content-Length', response.headers['content-length']);

    res.send(response.data);

  } catch (error) {
    console.log(error);
    res.status(404).json({ message: 'Not found' });
  }

});

app.post('/singIn', async (req, res) => {
  try {

    const validate = Joi.object({
      userName: Joi.string().required()
    });
  
    const { error } = validate.validate(req.query);
  
    if (error) return res.status(400).json({ error: error.details[0].message });
  
    let estadoSing = await singIn(req.query.userName);
  
    res.json(estadoSing);

  } catch (error) {

    res.status(500).json({ message: 'Error' });
    console.log(error);
  }

});

module.exports = app;