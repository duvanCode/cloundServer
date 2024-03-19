const express = require('express');
const Joi = require('joi');
const auth = require('../controllers/auth.controller.js');
const singIn = require('../controllers/singIn.controller.js');
const { getFile,setFile } = require('../controllers/file.controller.js');

const validate = Joi.object({
  userName: Joi.string().required()
});

var app = express();

app.post('/createFile', auth, async (req, res) => {
  const userId = req.userId;
  await setFile(req.file,userId);
  res.json({ message: 'Success! You have accessed a protected resource.' + userId });
});

app.post('/getFiles', auth, (req, res) => {
  const userId = req.userId;
  let query = { userId:userId };
  res.json({ message: 'Success! You have accessed a protected resource.' + userId });
});

app.get('/getFile/:id',async (req, res) => {
  const fileId = req.params.id;
  let message = await getFile(fileId);
  //let query = { _id:fileId };
  console.log(message);
  res.json({ message: 'Success! You have accessed a protected resource.' + fileId });
});

app.post('/singIn',async (req, res) => {

  const { error } = validate.validate(req.query);

  if (error) return res.status(400).json({ error: error.details[0].message });

  let estadoSing = await singIn(req.query.userName);

  res.json(estadoSing);

});

module.exports = app;