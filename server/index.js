const app = require('express')(),
      bodyParser = require('body-parser'),
      session = require('express-session'),
      massive = require('massive');
require('dotenv').config();

const { CONNECTION_STRING: cs, SERVER_PORT: sp, SECRET: secret } = process.env;

const ac = require('./controllers/authController');

massive(cs).then(db => {
    app.set('db', db);
    console.log('db connected');
})

app.use(bodyParser.json())
app.use(session({
    secret,
    resave: true,
    saveUninitialized: false
}));

/*
    Auth Endpoints
*/

app.post('/auth/register', ac.register);
app.get('/auth/currentUser', ac.getCurrentUser);
app.get('/auth/logout', ac.logout);
app.post('/auth/login', ac.login);

app.listen(sp, () => console.log(`listening on ${sp}`))