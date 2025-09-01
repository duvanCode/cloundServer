require('dotenv').config();
const express = require('express');
const contentSecurityPolicy = require('./app/middlewares/contentSecurityPolicy.middleware.js');
const cors = require('cors');

const homeRoutes = require('./app/routes/home.routes');
const registerRoutes = require('./app/routes/register.routes');
const fileRoutes = require('./app/routes/file.routes');

const app = express();

const SERVER_TIMEOUT = process.env.SERVER_TIMEOUT || (10 * 60 * 1000); // Default 10 min
const BODY_LIMIT = process.env.BODY_PARSER_LIMIT || '1024mb';
const REQUEST_TIMEOUT = process.env.REQUEST_TIMEOUT || (10 * 60 * 1000);
const PORT = process.env.PORT;

app.use(cors());
app.use(contentSecurityPolicy);
app.use(express.json({
    limit: BODY_LIMIT,
    timeout: REQUEST_TIMEOUT
}));

app.use(express.urlencoded({
    limit: BODY_LIMIT,
    extended: true,
    timeout: REQUEST_TIMEOUT
}));

app.use('/', homeRoutes);
app.use('/', registerRoutes);
app.use('/', fileRoutes);

app.listen(PORT, () => {
    console.log("servidor iniciado en el puerto:" + process.env.PORT);
  });

app.timeout = parseInt(SERVER_TIMEOUT);
app.keepAliveTimeout = parseInt(SERVER_TIMEOUT);
app.headersTimeout = parseInt(SERVER_TIMEOUT) + 1000;