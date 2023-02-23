const mongoose = require('mongoose');

module.exports = mongoose.model(
    'Task',
    new mongoose.Schema({
        title: {
            type: String,
            minlength: 5,
            required: [true, 'Title is required']
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        versionKey: false,
        id: true,
        toJSON: {
            virtuals: true,
            transform(doc, ret) {
                delete ret._id;
            }
        }
    })
);
