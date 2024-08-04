require('dotenv').config();
const { insertDocument,getDocumentById,updateDocument } = require('../models/user.model.js');
const { sendMessageTelegram,getFileById } = require('../services/file.service.js');

const getFile = async (messageId) => {

    let fileObject = await getDocumentById(messageId,process.env.MONGO_COLLECTION_FILES);

    if(!(fileObject)) {
        return false;
    }

    return fileObject;

}

const getBytesCount = () =>
{
    return (process.env.MEGA_BYTES_COUNT)*(1024**2);
}

function splitBufferByBytes(buffer, bytesPerChunk) {
    const bufferLength = buffer.length;
    const numChunks = Math.ceil(bufferLength / bytesPerChunk);

    let chunks = [];

    for (let i = 0; i < numChunks; i++) {
        const start = i * bytesPerChunk;
        const end = Math.min(start + bytesPerChunk, bufferLength);
        const chunk = buffer.slice(start, end);
        chunks.push(chunk);
    }

    return chunks;
}


const setFile = async (file, userID, serverUrl) => {

    const fileObject = {
        originalName: file.originalname,
        usuarioID: userID,
        originalSize: file.size,
        fileParts: []
    };

    try {
        const objectUrl = await insertDocument(fileObject, process.env.MONGO_COLLECTION_FILES);
        const fileUrl = `${serverUrl}/getFile/${objectUrl}`;
        
        return { 
            url: fileUrl,
            fileID:objectUrl,
            fileObject:fileObject
         };
    } catch (error) {
        console.error("Error al insertar el documento en MongoDB:", error);
        return false;
    }

}


const asyncUpdateFile = async (file,serviceObject) => {

    let fileID = serviceObject.fileID;
    let fileObject = serviceObject.fileObject;

    let buffer = file.buffer;
    let rageOfBuffer = splitBufferByBytes(buffer, getBytesCount());
    let part = 0;
    for (let range of rageOfBuffer) {
        try {
            let newBuffer = range;
            const newFile = {
                buffer: newBuffer,
                originalname: `file_part_${part}.txt`
            };

            let message = await sendMessageTelegram(newFile);

            if (!message) return false;

            const filePartDetails = {
                name: `file_part_${part}.txt`,
                size: newBuffer.length,
                telegramFileID: message.fileID,
                order: part
            };

            fileObject.fileParts.push(filePartDetails);

            await updateDocument(fileID,fileObject,process.env.MONGO_COLLECTION_FILES);

        } catch (error) {
            console.error("Error al actualizar el archivo:", error);
            return false;
        }
        part++;
    }

}


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { getFile,setFile,asyncUpdateFile };