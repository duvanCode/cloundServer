const app = require('./app/routes/file.routes');
require('dotenv').config();

app.listen(3000, () => {
    console.log("servidor iniciado");
  });