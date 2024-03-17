require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  let token = req.headers.authorization;
  if(token){
    token = token.split(' ')[1];
  }
  if (!token) return res.status(403).json({ error: 'No se proporcionó token' });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(500).json({ error: 'Token inválido' + err});
    req.userId = decoded.id;
    next();
  });
};

module.exports = auth;