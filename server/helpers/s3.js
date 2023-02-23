const S3 = require('aws-sdk/clients/s3');


const { AWS_REGION: region, AWS_ACCESS_KEY: accessKeyId, AWS_SECRET_KEY: secretAccessKey } = process.env;

const storage = new S3({ region, accessKeyId, secretAccessKey });


module.exports = {
    storage
}