require('dotenv').config();
const { insertDocument,getDocumentById } = require('../models/user.model.js');
const { sendMessageTelegram,getFileById } = require('../services/file.service.js');

const getFile = async (messageId) => {

    let fileObject = await getDocumentById(messageId,process.env.MONGO_COLLECTION_FILES);

    if(!(fileObject)) {
        return false;
    }

    return fileObject;

}

const setFile = async (file,userID,serverUrl) => {

    let message = await sendMessageTelegram(file);
    
    if(!message) return false;

    let fileCurrent = await getFileById(message.fileID);
    
    if(!file) return false;

    const fileObject = {
        fileName:message.name,
        url:`${process.env.TELEGRAM_API_URL}/file/bot${process.env.TELEGRAM_API_TOKEN}/${fileCurrent.file_path}`,
        usuarioID:userID
    };

    let objectUrl = await insertDocument(fileObject,process.env.MONGO_COLLECTION_FILES);

    return {
        "url":`${serverUrl}/getFile/${objectUrl}`
    }
}

module.exports = { getFile,setFile };