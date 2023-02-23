const crypto = require('crypto');

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const randomString = require('randomstring');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String
    },
    hashes: [{
        type: mongoose.Types.ObjectId,
        ref: 'Hash'
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
            delete ret.password;
            delete ret.salt;
        }
    }
});

userSchema.methods = {
    setPassword: function() {
        const password = randomString.generate({
            length: 10,
            charset: 'alphabetic'
        });

        this.salt = crypto.randomBytes(16).toString('hex');
        this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');

        return password;
    },
    validPassword: function(password) {
        const passwordEncrypted = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
        return this.password === passwordEncrypted;
    },
    setNewPassword: function(password = 'password') {
        this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
        return this;
    }
}

userSchema.plugin(uniqueValidator, {
    message: 'Error, {PATH} has been registered'
});


module.exports = mongoose.model('User', userSchema);
