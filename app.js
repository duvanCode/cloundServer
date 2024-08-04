require('dotenv').config();
const app = require('./app/routes/file.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const options = require('./swagger.js');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(options)));

app.listen(3000, () => {
    console.log("servidor iniciado");
  });