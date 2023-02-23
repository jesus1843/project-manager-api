const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

module.exports = mongoose.model(
    'Profile',
    new mongoose.Schema({
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        firstName: String,
        lastName: String,
        alias: String,
        avatar: String
    },
    {
        timestamps: true,
        versionKey: false,
        id: true,
        toJSON: {
            virtuals: true,
            transform(doc, ret) {
                delete ret._id;
                delete ret.userId;
            }
        }
    })
    .plugin(uniqueValidator, {
        message: 'Error, {VALUE} has been registered for "{PATH}"'
    })
);
