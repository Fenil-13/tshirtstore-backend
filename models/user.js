const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
require('dotenv').config()

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide the name'],
        maxlength: [40, "Name should be under 40 characters"]
    },
    email: {
        type: String,
        required: [true, 'Please provide the email'],
        validate: [validator.isEmail, "Please enter email in correct format"],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide the password'],
        minlength: [6, "Password should be atleast 6 char"],
        select: false // not come in any query
    },
    role: {
        type: String,
        default: "user"
    },
    photo: {
        id: {
            type: String,
            required: true
        },
        secure_url: {
            type: String,
            required: true
        }
    },
    forgotPasswordToken: String,
    forgotPasswordExipary: Date,
    createAt: {
        type: Date,
        default: Date.now
    }
})

//encrypt password before save password
//Trigger pre and post hook
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

//validate the password with passed on user password
userSchema.methods.isValidPassword = async function (userSendPassword) {
    return await bcrypt.compare(userSendPassword, this.password)
}

//create and return jwt token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    })
}

//generate forgot password token
userSchema.methods.getForgotPasswordToken = async function () {
    //generate a long and random string -nanoId and randomStirng and crypto
    const forgotToken = crypto.randomBytes(20).toString('hex');

    // getting hash - make sure to get a hash on backend
    this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex');

    //time of token
    this.forgotPasswordExipary = Date.now() + process.env.FORGOT_PASSWORD_EXPIRY

    return forgotToken
}

module.exports = mongoose.model('user', userSchema)
