const app = require('express')(),
      bodyParser = require('body-parser'),
      session = require('express-session'),
      massive = require('massive');
require('dotenv').config();

const { CONNECTION_STRING: cs, SERVER_PORT: sp, SECRET: secret } = process.env;



app.listen(sp, () => console.log(`listening on ${sp}`))