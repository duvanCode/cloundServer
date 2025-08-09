require('dotenv').config();
const app = require('./app/routes/file.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const options = require('./swagger.js');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(options)));

app.listen(process.env.PORT, () => {
    console.log("servidor iniciado en el puerto:" + process.env.PORT);
  });

app.timeout = parseInt(SERVER_TIMEOUT);
app.keepAliveTimeout = parseInt(SERVER_TIMEOUT);
app.headersTimeout = parseInt(SERVER_TIMEOUT) + 1000;
