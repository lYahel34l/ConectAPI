

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require('firebase-functions');

const express = require('express');
const { databaseURL } = require("firebase-functions/params");


const app = express();

app.get('/hello-world', (req, res)=>{
    return res.status(200).json({message:'Hello world'})
});

app.use(require('./routes/tecs.routes'));

exports.app = functions.https.onRequest(app);

