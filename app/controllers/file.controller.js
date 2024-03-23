require('dotenv').config();
const { insertDocument,getDocumentById } = require('../models/user.model.js');
const { setNewUrlUload,getTokenFile,sendMessage } = require('../services/file.service.js');

const getFile = async (messageId) => {

    let fileObject = await getDocumentById(messageId,process.env.MONGO_COLLECTION_FILES);

    if(!(fileObject)) {
        return false;
    }

    return fileObject.url;

}

const setFile = async (file,userID,serverUrl) => {

    let url = await setNewUrlUload();
    let token = await getTokenFile(url,file);
    let message =await sendMessage(token,userID);
    if(!message){
        return false;
    }

    const fileObject = { 
        url:message.message.body.attachments[0].payload.url,
        usuarioID:userID
    };

    let objectUrl = await insertDocument(fileObject,process.env.MONGO_COLLECTION_FILES);

    return {
        "url":`${serverUrl}/getFile/${objectUrl}`
    }
}

module.exports = { getFile,setFile };