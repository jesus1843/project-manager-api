const { TEMP_PATH, uploadAvatarToLocal, deleteAvatarFromLocal, renderAvatarLocal, avatarNotFoundPathLocal } = require('./avatar_image');
const { uploadAvatarToBucket, deleteAvatarFromBucket, renderAvatarProd, avatarNotFoundPathProd } = require('./avatar_image_prod');


function avatarNotFoundPath() {
    return +process.env.DEBUG
        ? avatarNotFoundPathLocal()
        : avatarNotFoundPathProd();
}

function deleteAvatar(avatarName) {
    if (+process.env.DEBUG) {
        return deleteAvatarFromLocal(avatarName);
    } else {
        return deleteAvatarFromBucket(avatarName);
    }
}

function uploadAvatarImage(email, avatar) {
    return +process.env.DEBUG ? uploadAvatarToLocal(email, avatar) : uploadAvatarToBucket(email, avatar);
}

async function renderAvatar(res, avatarPath) {
    if (+process.env.DEBUG) {
        await renderAvatarLocal(res, avatarPath);
    } else {
        await renderAvatarProd(res, avatarPath);
    }
}


module.exports = {
    TEMP_PATH,
    avatarNotFoundPath,
    deleteAvatar,
    uploadAvatarImage,
    renderAvatar
}
