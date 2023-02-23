const mongoose = require('mongoose');
const randomString = require('randomstring');

module.exports = mongoose.model(
    'Hash',
    new mongoose.Schema({
        kind: {
            type: String,
            default: 'verify-account',
            enum: {
                values: ['verify_account', 'forgot_password', 'change_password'],
                message: '{VALUE} is not valid'
            }
        },
        hash: String,
        usedAt: Date
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
        },
        methods: {
            setHash: function(hashLength=10) {
                this.hash = randomString.generate({
                    length: hashLength,
                    charset: 'alphabetic'
                });
                return this;
            }
        }
    })
);
