const express = require('express');
const Joi = require('joi');
const auth = require('../controllers/auth.controller.js');
const register = require('../controllers/register.controller.js');
const { getFile, setFile } = require('../controllers/file.controller.js');
const axios = require('axios');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


var app = express();

app.use(express.json());


app.post('/createFile', auth, async (req, res) => {
  try {

    const uploadSingle = upload.single('file');

    uploadSingle(req, res, async (err) => {

      if (!(req.file)) {
        return res.status(400).json({ error: 'missed file' });
      }

      const serverUrl = `${req.protocol}://${req.get('host')}`;
      const userId = req.userId;
      let result = await setFile(req.file, userId, serverUrl);

      res.json(result);
    });

  } catch (error) {
    res.status(400).json({ error: 'missed file' });
    console.log();
  }
});

app.get('/getFile/:id', async (req, res) => {
  try {

    const fileId = req.params.id;
    let url = await getFile(fileId);

    if (!url) {
      res.status(404).json({ error: 'Not found' });
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
    res.status(404).json({ error: 'Not found' });
  }

});

app.post('/register', async (req, res) => {
  try {
    const { userName } = req.body;

    const validate = Joi.object({
      userName: Joi.string().required()
    });
  
    const { error } = validate.validate(req.body);
  
    if (error) return res.status(400).json({ error: error.details[0].message });
  
    let estadoSing = await register(userName);
  
    res.json(estadoSing);

  } catch (error) {

    res.status(500).json({ error: 'Error' });
    console.log(error);
  }

});

module.exports = app;