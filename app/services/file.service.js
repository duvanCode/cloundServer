require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');

const sendMessageTelegram = async (file) =>{
    
    try{
        let url = `${process.env.TELEGRAM_API_URL}/bot${process.env.TELEGRAM_API_TOKEN}/sendDocument`;
        const formData = new FormData();
        formData.append('chat_id', process.env.TELEGRAM_CHAT_ID);
        formData.append('disable_notification', 'true');
        formData.append('document', file.buffer, file.originalname);
        const response = await axios.post(url,formData, {
            headers: formData.getHeaders()
        });

        if(response.status == 403){

          console.error('Error en la respuesta del servicio:', response.status);
          return false;

        }else if (response.status !== 200) {
            console.error('Error en la respuesta del servicio:', response.status);
            return false;
        }

        let data = response.data;

        if(!(data.ok)){
            console.error('Error enviando mensaje');
            return false;
        }
        

        const fileObject = getFileObject(data);

        return fileObject;

    } catch (error){

        console.error('Error en sendMessageTelegram', error);

    }
}

const getFileObject = (data) => {
    let name,fileID;

    if(data.result.document != undefined){
        name = data.result.document.file_name;
        fileID = data.result.document.file_id;
    }

    if(data.result.video != undefined){
        name = data.result.video.file_name;
        fileID = data.result.video.file_id;
    }

    if(data.result.photo != undefined){
        name = data.result.photo.file_name;
        fileID = data.result.photo.file_id;
    }

    if(data.result.audio != undefined){
        name = data.result.audio.file_name;
        fileID = data.result.audio.file_id;
    }

    if(data.result.animation != undefined){
        name = data.result.animation.file_name;
        fileID = data.result.animation.file_id;
    }

    if(data.result.voice != undefined){
        name = data.result.voice.file_name;
        fileID = data.result.voice.file_id;
    }
    if(data.result.sticker != undefined){
        name = "name.webp";
        fileID = data.result.sticker.file_id;
    }

    if(name == undefined || fileID == undefined){
        console.log('error buscando el id');
        return false;
    }

    return {
        name:name,
        fileID:fileID
    }

}

const getFileById = async (id) => {
    try{
        
        let url = `${process.env.TELEGRAM_API_URL}/bot${process.env.TELEGRAM_API_TOKEN}/getFile?file_id=${id}`;

        const response = await axios.get(url);

        if(response.status == 403){

          console.error('Error en la respuesta del servicio:', response.status);
          return false;

        }else if (response.status !== 200) {
            console.error('Error en la respuesta del servicio:', response.status);
            return false;
        }

        let data = response.data;

        if(!(data.ok)){
            console.error('Error enviando mensaje');
            return false;
        }

        const fileObject = {
            file_path:data.result.file_path
        }

        return fileObject;

    } catch (error){

        console.error('Error en getFileById', error);

    }
}


const sendMessage = async (token,userID) => {
    try{
        const jsonData = {
            "text": "archivo de " + userID,
            "attachments": [
              {
                "type": "file",
                "payload": {
                  "token": token
                }
              }
            ],
            "notify": true,
            "format": "markdown"
          };

        const response = await axios.post(`${process.env.TAM_TAM_API_URL}/messages?access_token=${process.env.TAM_TAM_API}&chat_id=${process.env.TAM_TAM_CHAT_ID}`,jsonData, {
            headers: {
                'Content-Type': 'application/json'
              }
        });

        if (response.status !== 200) {
            console.error('Error en la respuesta del servicio:', response.status);
            return;
        }

        let data = response.data;

        return data;

        } catch(error){
        console.log('error al consumir el servicio');
        return false;

      }
}

const setNewUrlUload = async () => {
    try {
        const response = await axios.post(`${process.env.TAM_TAM_API_URL}/uploads?access_token=${process.env.TAM_TAM_API}&type=file`);

        if (response.status !== 200) {
            console.error('Error en la respuesta del servicio:', response.status);
            return null;
        }

        const data = response.data;

        return data.url;

    } catch (error) {
        console.log(error);
    }
}

const getTokenFile = async (url,file) => {
    try{

        const formData = new FormData();
        formData.append('file', file.buffer, file.originalname);
        const response = await axios.post(url,formData, {
            headers: formData.getHeaders()
        });

        if(response.status == 403){

          console.error('Error en la respuesta del servicio:', response.status);
          return;

        }if (response.status !== 200) {
            console.error('Error en la respuesta del servicio:', response.status);
            return;
        }

        let data = response.data;

        return data.token;

    } catch (error){

        console.error('Error al generar el token:', error);

    }
}

module.exports = { setNewUrlUload,getTokenFile,sendMessage,sendMessageTelegram,getFileById };