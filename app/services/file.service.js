require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');

const getFileService = async (id) => {
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

const sendMessage = async (token,userID) => {
    try{
        const jsonData = {
            "text": "archivo de "+userID,
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

const setNewUrlUload = async () =>{
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

module.exports = { getFileService,setNewUrlUload,getTokenFile,sendMessage };