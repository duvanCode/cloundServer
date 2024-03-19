require('dotenv').config();

const jwt = require('jsonwebtoken');

const { insertDocument, getDocuments } = require('../models/user.model.js');

async function singIn(userName) {

    let userGet = await getDocuments({ userName: userName },process.env.MONGO_COLLECTION_USER);

    if (userGet.length > 0 ){
        return { status: 'error', mjs: 'usuario ya registrado' };
    }

    var token = jwt.sign({ user: userName }, process.env.JWT_SECRET);

    const user = {
        userName: userName,
        token: token
    }
    
    let id = await insertDocument(user,process.env.MONGO_COLLECTION_USER);


    if (!id) return { status: 'error', mjs: 'error creando el usuario' };

    return { status: 'ok', token: token };
}

module.exports = singIn;