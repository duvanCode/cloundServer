require('dotenv').config();
const jwt = require('jsonwebtoken');
const { insertDocument, getDocuments } = require('../models/user.model.js');

const auth = async (req, res, next) => {
  let token = req.headers.authorization;
  
  if(token){
    token = token.split(' ')[1];
  }

  if (!token) return res.status(403).json({ error: 'No se proporcionó token' });
  jwt.verify(token, process.env.JWT_SECRET,async (err, decoded) => {
    if (err) return res.status(500).json({ error: 'Token inválido' + err});

    let userGet = await getDocuments({ userName: decoded.user },process.env.MONGO_COLLECTION_USER);

    if(userGet.length <= 0 ) return res.status(403).json({ error: 'Usuario no registrado' });

    req.userId = userGet[0]._id;
    next();
  });
};

module.exports = auth;