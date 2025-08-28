require('dotenv').config();
const app = require('./app/routes/file.routes');

const SERVER_TIMEOUT = process.env.SERVER_TIMEOUT || (10 * 60 * 1000);
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("servidor iniciado en el puerto:" + process.env.PORT);
  });

app.timeout = parseInt(SERVER_TIMEOUT);
app.keepAliveTimeout = parseInt(SERVER_TIMEOUT);
app.headersTimeout = parseInt(SERVER_TIMEOUT) + 1000;
