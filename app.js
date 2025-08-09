require('dotenv').config();
const app = require('./app/routes/file.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const options = require('./swagger.js');

const SERVER_TIMEOUT = process.env.SERVER_TIMEOUT || (10 * 60 * 1000);
const PORT = process.env.PORT;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(options)));

app.listen(PORT, () => {
    console.log("servidor iniciado en el puerto:" + process.env.PORT);
  });

app.timeout = parseInt(SERVER_TIMEOUT);
app.keepAliveTimeout = parseInt(SERVER_TIMEOUT);
app.headersTimeout = parseInt(SERVER_TIMEOUT) + 1000;
