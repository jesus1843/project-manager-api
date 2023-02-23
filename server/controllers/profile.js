const fs= require('fs');
const path = require('path');

const ProfileModel = require('../models/profile');

const {
    TEMP_PATH,
    avatarNotFoundPath, deleteAvatar, uploadAvatarImage, renderAvatar
} = require('../helpers/image_upload');


const fetchProfile = async(req, res) => {
    const { user } = req;

    try {
        const profile = await ProfileModel.findOne({ userId: user.id });

        res.json({
            data: profile
        });
    }
    catch(err) {
        res.status(500).json({
            error: JSON.parse(JSON.stringify(err))
        });
    }
}

const updateProfile = async(req, res) => {
    const { user } = req;
    const { firstName, lastName, alias } = req.body;

    try {
        const profile = await ProfileModel.findOneAndUpdate(
            { userId: user.id },
            { firstName, lastName, alias },
            { new: true }
        );

        res.status(201).json({
            data: profile
        });
    }
    catch(error) {
        res.status(500).json({
            error: JSON.parse(JSON.stringify(error))
        });
    }
}

const fetchAvatar = async(req, res) => {
    const { user } = req;

    try {
        const profile = await ProfileModel.findOne({ userId: user.id }, 'avatar');

        await renderAvatar(res, profile.avatar);


        // res.json({
        //     profile
        // });
    }
    catch(error) {
        console.log(error);
        res.status(500).sendFile(avatarNotFoundPath());
    }
}

const uploadAvatar = async(req, res) => {
    const { id, email } = req.user;
    const { avatar } = req.files;

    const profile = await ProfileModel.findOne({ userId: id }, '_id avatar');

    uploadAvatarImage(email, avatar)
        .then(async(result) => {
            await deleteAvatar(profile.avatar);

            profile.avatar = result.key;
            await profile.save();

            res.status(201).json({
                message: 'Image Uploaded',
                avatar_path: result.key
            });
        })
        .catch(err => {
            res.status(500).json({
                error: JSON.parse(JSON.stringify(err))
            });
        });
}

const temps = (req, res) => {
    fs.readdir(TEMP_PATH, (error, files) => {
        if (error) {
            return res.status(500).json({ error })
        }

        files.forEach(file => {
            fs.unlinkSync(path.resolve(TEMP_PATH, file))
        });

        res.json({ messages: 'Files Deleted' });
    });
}


module.exports = {
    fetchProfile,
    updateProfile,
    fetchAvatar,
    uploadAvatar,
    temps
}
