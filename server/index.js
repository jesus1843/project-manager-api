require('dotenv').config();

const path = require('path');

const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');

const s3 = require('./helpers/s3');

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(express.static(path.resolve(__dirname, '../public')));
server.use(cors());

server.use('/api', require('./routes'));

server.use((req, res, next) => {
    res.status(404).json({
        error: 'Prefix must be "/api"'
    });
});

const {
    MONGO_CONN_PROD,
    MONGO_CLUSTER_PROD,
    MONGO_PWD_PROD
} = process.env;

const MONGO_URI = `${ MONGO_CONN_PROD }://${ MONGO_CLUSTER_PROD }:${ MONGO_PWD_PROD }@aws-api.gjl8o59.mongodb.net?retryWrites=true&w=majority`;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log(
            +process.env.DEBUG
                ? 'Localhost MongoDB Database running in port: 27017'
                : 'Production MongoDB Database running...'
        );

        server.listen(
            +process.env.PORT,
            () => console.log(`Server running by port: ${ process.env.PORT }`)
        );
    })
    .catch(error => console.log(error));

