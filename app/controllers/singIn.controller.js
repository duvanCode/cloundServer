require('dotenv').config();
const jwt = require('jsonwebtoken');

const singIn = (userName) => {
    var token = jwt.sign({ user:userName }, process.env.JWT_SECRET);
    return token;
}

module.exports = singIn;