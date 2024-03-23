require('dotenv').config();

const jwt = require('jsonwebtoken');

const { insertDocument, getDocuments } = require('../models/user.model.js');

async function register(userName) {

    let userGet = await getDocuments({ userName: userName },process.env.MONGO_COLLECTION_USER);

    if (userGet.length > 0 ){
        return { error: 'usuario ya registrado' };
    }

    var token = jwt.sign({ user: userName }, process.env.JWT_SECRET);

    const user = {
        userName: userName,
        token: token
    }
    
    let id = await insertDocument(user,process.env.MONGO_COLLECTION_USER);


    if (!id) return { error: 'error creando el usuario' };

    return { token: token };
}

module.exports = register;