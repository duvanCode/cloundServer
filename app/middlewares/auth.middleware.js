require('dotenv').config();
const jwt = require('jsonwebtoken');
const { insertDocument, getDocuments } = require('../models/user.model.js');

const auth = async (req, res, next) => {

  try {

    let token = getHeaderToken(req);

    if (!token) return res.status(403).json({
      "success": false,
      "message": "No token provided",
      "data": null
    });

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {

      if (err) return res.status(500).json({
        "success": false,
        "message": "Invalid Token" + err,
        "data": null
      });

      let userGet = await getDocuments({ userName: decoded.user }, process.env.MONGO_COLLECTION_USER);

      if (userGet.length <= 0) return res.status(403).json({
        "success": false,
        "message": "Unregistered user",
        "data": null
      });

      req.userId = userGet[0]._id;
      next();

    });


  } catch (e) {
    res.status(500).json({
      "success": false,
      "message": "error processing request",
      "data": null
    });
  }

};

const getHeaderToken = (req) => {

  let token = req.headers.authorization;

  if (token) {
    token = token.split(' ')[1];
  }

  return token;

}

module.exports = auth;