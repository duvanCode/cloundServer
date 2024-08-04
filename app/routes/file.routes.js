const express = require('express');
const Joi = require('joi');
const auth = require('../middlewares/auth.middleware.js');
const register = require('../controllers/register.controller.js');
const { getFile, setFile,asyncUpdateFile } = require('../controllers/file.controller.js');
const { getFileById } = require('../services/file.service.js');
const axios = require('axios');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { PassThrough,Readable } = require('stream');
const mime = require('mime-types');


var app = express();

app.use(express.json());


app.post('/createFile', auth, async (req, res) => {
  try {

    const uploadSingle = upload.single('file');

    uploadSingle(req, res, async (err) => {

      if (!(req.file)) {
        return res.status(400).json({ error: 'missed file' });
      }

      const serverUrl = `${req.protocol}://${req.get('host')}`;
      const userId = req.userId;
      let result = await setFile(req.file, userId, serverUrl);
      asyncUpdateFile(req.file,result);

      res.json({
        url:result.url,
        msj:"el archivo se encuentra en cola"
      });
      
    });

  } catch (error) {
    res.status(400).json({ error: 'missed file' });
  }
  
});

app.get('/getFile/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await getFile(fileId);

    let partsize = Object.values(file.fileParts).reduce((total, valor) => total + valor.size, 0);

    if(partsize < file.originalSize )
    {
        let total = file.originalSize;
        let porcentaje = (partsize * 100)/ total;
        res.status(200).json({
            msj:"el archivo se en cola",
            progress:porcentaje
        });
        return;
    }

    res.set('Content-Disposition', `attachment; filename="${file.originalName}"`);
    res.set('Content-Type', mime.lookup(file.originalName));

    for (const filePart of file.fileParts) {
        const urlPart = await getFileById(filePart.telegramFileID);

        if (!urlPart) {
            res.status(404).json({ error: 'Not found' });
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
            res.status(500).json({ error: 'Error' });
            return;
        }
    }

    res.end();
} catch (error) {
    console.error('Error en el proceso principal:', error);
    res.status(500).json({ error: 'Error' });
}


});

app.post('/register', async (req, res) => {
  try {
    const { userName } = req.body;

    const validate = Joi.object({
      userName: Joi.string().required()
    });
  
    const { error } = validate.validate(req.body);
  
    if (error) return res.status(400).json({ error: error.details[0].message });
  
    let estadoSing = await register(userName);
  
    res.json(estadoSing);

  } catch (error) {

    res.status(500).json({ error: 'Error' });
    console.log(error);
  }

});

module.exports = app;