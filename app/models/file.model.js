require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const { insertDocument, getDocuments } = require('./user.model.js');

const getFileModel = async (id) => {
    try {

        const response = await axios.get(`https://botapi.tamtam.chat/messages?access_token=${process.env.TAM_TAM_API}&message_ids=${id}`);

        if (response.status !== 200) {
            console.error('Error en la respuesta del servicio:', response.status);
            return;
        }

        const data = response.data;

        return data;

    } catch (error) {

        console.error('Error al consumir el servicio:', error);

    }

    return result;
}

const setFileModel = async (file) => {

    const query = { name:"url_upload" };
    let objectUrl = await getDocuments(query,process.env.MONGO_COLLECTION_FILES);
    let token = await getTokenFile(objectUrl[0].url,file);
    console.log(token);

}

const getTokenFile = async (url,file) => {
    try{

        const formData = new FormData();
        formData.append('file', file.buffer, file.originalname);
        const response = await axios.post(url,formData, {
            headers: formData.getHeaders()
        });

        if (response.status !== 200) {
            console.error('Error en la respuesta del servicio:', response.status);
            return;
        }

        let data = response.data;

        return data.token;

    } catch (error){

        console.error('Error al consumir el servicio:', error);

    }
}

module.exports = { getFileModel,setFileModel };