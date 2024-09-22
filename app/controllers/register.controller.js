require('dotenv').config();

const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcrypt');


const { insertDocument, getDocuments } = require('../models/user.model.js');

async function register(username,password) {

    let userGet = await getDocuments({ username: username }, process.env.MONGO_COLLECTION_USER);

    if (userGet.length > 0) {
        return {
            "success": false,
            "message": 'existing user',
            "data": null
        };

    }

    let passwordHash = await generarHash(password);

    if(!(passwordHash.success)) return passwordHash;

    const user = {
        username: username,
        password:passwordHash.data
    }

    let id = await insertDocument(user, process.env.MONGO_COLLECTION_USER);

    if (!id) return {
        "success": false,
        "message": 'error creating user',
        "data": null
    }
    
    let tokenUser = await generateUserToken(id);

    if(!(tokenUser.success)) return tokenUser;

    return {
        "success": true,
        "message": 'user created successfully',
        "data": tokenUser.data
    }

}


const generateUserToken = async (userID) => {
    
    try {
        
        let dates = getDate();
        let createdDate = dates.now;
        let expirationDate = dates.tomorrow;
        let guuID = generateUUID();

        
        let userToken = {
            userID,
            createdDate,
            expirationDate,
            guuID,
        };


        let tokenID = await insertDocument(userToken, process.env.MONGO_COLLECTION_TOKENS);

        if(!(tokenID)) return {
            "success": false,
            "message": 'error al ingresar el token',
            "data": null
        };

        let tokenJWT = jwt.sign({ guuID: guuID }, process.env.JWT_SECRET);

        return {
            "success": true,
            "message": 'ok',
            "data": {
                token:tokenJWT
            }
        }
        
    } catch (e) {

        return {
            "success": false,
            "message": 'error al generar token',
            "data": e
        };
    
    }

};

function formatearFecha(fecha) {
    const opciones = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };

    return new Intl.DateTimeFormat('sv-SE', opciones).format(fecha).replace(' ', 'T').replace('T', ' ');
}

const getDate = () => {
    const fechaActual = new Date();
    const fechaDosDiasMas = new Date(fechaActual);
    fechaDosDiasMas.setDate(fechaDosDiasMas.getDate() + 2);
    return {
        now:formatearFecha(fechaActual),
        tomorrow:formatearFecha(fechaDosDiasMas)
    };
}

async function generarHash(contrasena) {
    try {
        const saltRounds = 10;
        const contrasenaHash = await bcrypt.hash(contrasena, saltRounds);
        return {
            "success": true,
            "message": 'ok',
            "data": contrasenaHash
        };
    } catch (error) {
        console.error('Error al generar el hash:', error);
        return {
            "success": false,
            "message": 'Error al generar hash',
            "data": null
        }
    }
}

async function verificarContrasena(contrasenaIngresada, contrasenaHash) {
    try {
        const esValida = await bcrypt.compare(contrasenaIngresada, contrasenaHash);

        return {
            "success": true,
            "message": 'ok',
            "data": esValida
        };
    } catch (error) {
        console.error('Error al verificar la contraseña:', error);
        return {
            "success": false,
            "message": 'Error al verificar clave hash',
            "data": null
        }
    }
}


const registerUser = async (req, res) => {
    try {
        const { username,password } = req.body;

        const validate = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required()
        });

        const { error } = validate.validate(req.body);

        if (error) return res.status(400).json({
            "success": false,
            "message": 'error entering data',
            "data": error.details.map(a => a?.message)
        });

        let estadoSing = await register(username,password);

        res.json(estadoSing);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            "success": false,
            "message": 'server internal error',
            "data": null
        });
    }

}


function generateUUID()
{
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

const loginUser = async (req, res) => {

    try {
        const { username,password } = req.body;

        const validate = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required()
        });

        const { error } = validate.validate(req.body);

        if (error) return res.status(400).json({
            "success": false,
            "message": 'error entering data',
            "data": error.details.map(a => a?.message)
        });

        res.json(await login(username,password));

    } catch (error) {
        console.log(error);
        res.status(500).json({
            "success": false,
            "message": 'error',
            "data": null
        });
    }

}


const login = async (username,password) => {

    let userGet = await getDocuments({ username: username }, process.env.MONGO_COLLECTION_USER);

    if (!(userGet.length > 0)) return {
        "success": false,
        "message": 'inexisting user',
        "data": null
    }

    let estadoPass = await verificarContrasena(password,userGet[0].password);

    if(!(estadoPass.success)) return estadoPass;

    let tokenUser = await generateUserToken(userGet[0]._id);

    if(!(tokenUser.success)) return tokenUser;

    return {
        "success": true,
        "message": 'user logged successfully',
        "data": tokenUser.data
    }

}

module.exports = {registerUser, loginUser };