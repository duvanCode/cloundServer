require('dotenv').config();

const jwt = require('jsonwebtoken');
const Joi = require('joi');


const { insertDocument, getDocuments } = require('../models/user.model.js');

async function register(userName) {

    let userGet = await getDocuments({ userName: userName }, process.env.MONGO_COLLECTION_USER);

    if (userGet.length > 0) {
        return {
            "success": false,
            "message": 'existing user',
            "data": null
        };

    }

    let token = jwt.sign({ user: userName }, process.env.JWT_SECRET);

    const user = {
        userName: userName,
        token: token
    }

    let id = await insertDocument(user, process.env.MONGO_COLLECTION_USER);

    if (!id) return {
        "success": false,
        "message": 'error creating user',
        "data": null
    }

    return {
        "success": true,
        "message": 'user created successfully',
        "data": user
    }
}

const registerUser = async (req, res) => {
    try {
        const { userName } = req.body;

        const validate = Joi.object({
            userName: Joi.string().required()
        });

        const { error } = validate.validate(req.body);

        if (error) return res.status(400).json({
            "success": false,
            "message": 'error entering data',
            "data": error.details.map(a => a?.message)
        });

        let estadoSing = await register(userName);

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

module.exports = registerUser;