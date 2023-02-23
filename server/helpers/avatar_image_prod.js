const fs = require('fs');

const { dateAvatarName } = require('./date-format');
const { storage } = require('./s3');








function avatarNotFoundPathProd() {
    return `${process.env.AWS_HOST_BUCKET}${'img/not-found/not-found.jpg'}`;
}

function avatarPathFormat(email, extension) {
    return `${ email }/${ dateAvatarName() }.${ extension }`;
}

function fullAvatarDir(avatarPath) {
    if (!avatarPath) {
        return avatarNotFoundPathProd();
    }
    return `${process.env.AWS_HOST_BUCKET}${avatarPath}`;
}

function deleteAvatarFromBucket(avatarName) {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: avatarName
    };

    return storage.deleteObject(params).promise();
}

const uploadAvatarToBucket = (email, file) => {
    const extension = file.name.split('.').pop();

    const avatarRelativePath = avatarPathFormat(email, extension);
    const stream = fs.createReadStream(file.tempFilePath);

    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `img/avatars/${avatarRelativePath}`,
        Body: stream
    }

    return storage.upload(params).promise();
}

async function renderAvatarProd(res, avatarPath) {
    const imgUrlData = await fetch(`${process.env.AWS_HOST_BUCKET}${avatarPath}`);
    const buffer = await imgUrlData.arrayBuffer();

    const base64Data = Buffer.from(buffer).toString('base64');
    const image = Buffer.from(base64Data, 'base64');

    res.writeHead(200, {
        'Content-Type': 'image/jpg',
        'Content-Length': image.length
    });
    res.end(image);
}


module.exports = {
    avatarNotFoundPathProd,
    avatarPathFormat,
    fullAvatarDir,
    deleteAvatarFromBucket,
    uploadAvatarToBucket,
    renderAvatarProd
}
