const express = require('express');
const Joi = require('joi');
const auth = require('../controllers/auth.controller.js');
const singIn = require('../controllers/singIn.controller.js');

const validate = Joi.object({
  userName: Joi.string().required()
});

var app = express();

app.post('/createFile', auth, (req, res) => {
  res.json({ message: 'Success! You have accessed a protected resource.' });
});

app.post('/singIn',(req, res) => {
  const { error } = validate.validate(req.query);
  if (error) return res.status(400).json({ error: error.details[0].message });
  let token = singIn(req.params.userName);
  res.json({ token:token });
});

module.exports = app;