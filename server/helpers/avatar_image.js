const fs = require('fs');
const path = require('path');

const { dateAvatarName } = require('./date-format');


const UPLOADS_PATH = path.resolve(__dirname, '../../uploads');

const TEMP_PATH = path.resolve(UPLOADS_PATH, 'temp');
const AVATARS_PATH = path.resolve(UPLOADS_PATH, 'img/avatars');


function avatarNotFoundPathLocal() {
    return path.resolve(UPLOADS_PATH, 'img/not-found/not-found.jpg');
}

function avatarPathFormat(email, extension) {
    return `${ email }/${ dateAvatarName() }.${ extension }`;
}

function fullAvatarDir(avatarPath) {
    if (!avatarPath) {
        return avatarNotFoundPathLocal();
    }
    return path.resolve(AVATARS_PATH, avatarPath);
}

function deleteAvatarFromLocal(avatarName) {
    const avatarPath = path.resolve(AVATARS_PATH, avatarName);

    if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
    }
    return Promise.resolve({});
}

function uploadAvatarToLocal(email, file) {
    const extension = file.name.split('.').pop();

    const avatarRelativePath = avatarPathFormat(email, extension);
    const avatarFullPath = fullAvatarDir(avatarRelativePath);
    console.log(avatarFullPath);

    return new Promise((resolve, reject) => {
        file.mv(avatarFullPath, err => {
            if (err) {
                reject({
                    error: err
                });
            }
            resolve({
                key: avatarRelativePath,
                Key: avatarRelativePath
            });
        });
    });
}

async function renderAvatarLocal(res, avatarPath) {
    const avatarContent = fullAvatarDir(avatarPath);

    res.sendFile(avatarContent);
}


module.exports = {
    TEMP_PATH,
    avatarNotFoundPathLocal,
    deleteAvatarFromLocal,
    uploadAvatarToLocal,
    renderAvatarLocal
}
