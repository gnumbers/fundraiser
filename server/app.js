'use strict';
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const multer = require('multer');

const config = require('./config');

const app = express();

// app.use(multer({ dest: './uploads/'}));
app.use(cookieParser());
app.use(session(config.SESSION_CONFIG));

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin); // TODO change this in production
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});

const authRoutes = require('./auth/routes');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static('public'));
// Routes

app.get('/', (req, res, next) => {
    res.status(200).send('Welcome to Raiserve!');
    next();
});
app.use(authRoutes);

app.listen(config.EXPRESS_PORT);

console.log(`It's on! Go to http://localhost:${config.EXPRESS_PORT}`)

module.exports = app;
