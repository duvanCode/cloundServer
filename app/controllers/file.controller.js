const { insertDocument, getDocumentById, updateDocument } = require('../models/user.model.js');
const { sendMessageTelegram, getFileById } = require('../services/file.service.js');
const multer = require('multer');
const { PassThrough, Readable } = require('stream');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const mime = require('mime-types');
const axios = require('axios');
require('dotenv').config();

const getFileService = async (messageId) => {

    let fileObject = await getDocumentById(messageId, process.env.MONGO_COLLECTION_FILES);

    if (!(fileObject)) {
        return false;
    }

    return fileObject;

}

const getBytesCount = () => {
    return (process.env.MEGA_BYTES_COUNT) * (1024 ** 2);
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
            fileID: objectUrl,
            fileObject: fileObject
        };
    } catch (error) {
        console.error("Error al insertar el documento en MongoDB:", error);
        return false;
    }

}


const asyncUpdateFile = async (file, serviceObject) => {

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

            console.log('file part uploaded: ',(part + 1),' of ',rageOfBuffer.length);
            const filePartDetails = {
                name: `file_part_${part}.txt`,
                size: newBuffer.length,
                telegramFileID: message.fileID,
                order: part
            };

            fileObject.fileParts.push(filePartDetails);

            await updateDocument(fileID, fileObject, process.env.MONGO_COLLECTION_FILES);

        } catch (error) {
            console.error("Error al actualizar el archivo:", error);
            return false;
        }
        part++;
    }

}
const createFile = async (req, res) => {
    try {

        const uploadSingle = upload.single('file');

        uploadSingle(req, res, async (err) => {

            if (!(req.file)) {
                return res.status(400).json({
                    "success": false,
                    "message": 'missed file',
                    "data": null
                });

            }

            const serverUrl = `${req.protocol}://${req.get('host')}`;
            const userId = req.userId;
            let result = await setFile(req.file, userId, serverUrl);
            asyncUpdateFile(req.file, result);

            res.json({
                "success": true,
                "message": 'the file is in queue',
                "data": {
                    url: result.url
                }
            });

        });

    } catch (error) {

        res.status(500).json({
            "success": false,
            "message": 'server internal error',
            "data": null
        });
    }

};


const getFile = async (req, res) => {
    try {
        const fileId = req.params.id;
        const file = await getFileService(fileId);

        if (!file) {
            res.status(404).json({
                "success": false,
                "message": 'file no found',
                "data": null
            });
            return;
        };

        let partsize = Object.values(file.fileParts).reduce((total, valor) => total + valor.size, 0);

        if (partsize < file.originalSize) {
            let total = file.originalSize;
            let porcentaje = (partsize * 100) / total;
            res.status(200).json({
                "success": true,
                "message": 'the file is in queue',
                "data": {
                    progress: porcentaje
                }
            });
            return;
        }

        res.set('Content-Disposition', `attachment; filename="${file.originalName}"`);
        res.set('Content-Type', mime.lookup(file.originalName));

        for (const filePart of file.fileParts) {
            const urlPart = await getFileById(filePart.telegramFileID);

            if (!urlPart) {
                res.status(404).json({
                    "success": false,
                    "message": 'Not found',
                    "data": null
                });
                return;
            }

            try {
                const response = await axios.get(`${process.env.TELEGRAM_API_URL}/file/bot${process.env.TELEGRAM_API_TOKEN}/${urlPart.file_path}`, { responseType: 'stream' });

                response.data.on('data', (chunk) => {
                    res.write(chunk);
                });

                await new Promise((resolve) => {
                    response.data.on('end', () => {
                        resolve();
                    });
                });
            } catch (error) {
                console.error('Error al obtener el archivo parcial:', error);
                res.status(500).json({
                    "success": false,
                    "message": 'server internal error',
                    "data": null
                });
                return;
            }
        }

        res.end();
    } catch (error) {
        console.error('Error en el proceso principal:', error);
        res.status(500).json({
            "success": false,
            "message": 'server internal error',
            "data": null
        });
    }


};

module.exports = { getFile, setFile, asyncUpdateFile, createFile };