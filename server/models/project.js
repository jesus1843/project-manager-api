const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

module.exports = mongoose.model(
    'Project',
    new mongoose.Schema({
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        },
        tasks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task'
        }]
    },
    {
        timestamps: true,
        versionKey: false,
        id: true,
        toJSON: {
            virtuals: true,
            transform(doc, ret) {
                delete ret._id;
                delete ret.owner;
            }
        }
    })
    .plugin(uniqueValidator, {
        message: 'Error, {VALUE} for {PATH} has been registered'
    })
);
