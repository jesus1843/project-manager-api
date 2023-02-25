require('dotenv').config();

const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const fetch = require('node-fetch');

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
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

        fetch('http://localhost:5000/api/profile/avatar?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjNmMjQxOTRiMTBlYTM4OTI3M2UwM2Y2IiwiZW1haWwiOiJhZG1pbkBlbWFpbC5jb20iLCJjcmVhdGVkQXQiOiIyMDIzLTAyLTE5VDE1OjM1OjAwLjQxMloiLCJ1cGRhdGVkQXQiOiIyMDIzLTAyLTE5VDE2OjAzOjU0Ljc5NloiLCJoYXNoZXMiOnt9fSwiaWF0IjoxNjc3MzM3MzQ5LCJleHAiOjE2Nzc5NDIxNDl9.b92XsS6hzOvQyg6K5mo2n4lWv2rT8LBjzpkmz7RRr1c')
            .then(async(imgUrlData) => {
                const buffer = await imgUrlData.arrayBuffer();
                const base64Data = Buffer.from(buffer).toString('base64');
                // const image = Buffer.from(base64Data, 'base64');
                console.log(base64Data);
            })

        server.listen(
            +process.env.PORT,
            () => console.log(`Server running by port: ${ process.env.PORT }`)
        );
    })
    .catch(error => console.log(error));

