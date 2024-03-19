require('dotenv').config();
const { insertDocument, getDocuments } = require('../models/user.model.js');
const { getFileModel,setFileModel } = require('../models/file.model.js');

const getFile = async (messageId) => {

    let fileObject = await getFileModel(messageId);
    console.log(fileObject.messages);

}

const setFile = async (file,userID) => {
    console.log(file,'file');
    return await setFileModel(file);
}

module.exports = { getFile,setFile };