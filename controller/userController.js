const User = require('../models/user')
const BigPromise = require('../middlewares/bigPromis')
const CustomError = require('../utils/CustomError')
const cookieToken = require('../utils/cookieToken')
const cloudinary = require('cloudinary').v2

exports.signup = BigPromise(async (req, res, next) => {

    let result;

    if (!req.files) {
        return next(new CustomError('Picture required', 400))
    }

    const { name, email, password } = req.body

    if (!email || !password || !name) {
        return next(new CustomError('Name,password and email are required', 400))
    }

    let file = req.files.userPhoto

    result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "users",
        width: 150,
        crop: "scale"
    })

    const user = await User.create({
        name,
        email,
        password,
        photo: {
            id: result.public_id,
            secure_url: result.secure_url
        }
    })

    cookieToken(user, res)

})

exports.login = BigPromise(async (req, res, next) => {
    const { email, password } = req.body

    //check for presence of email and password
    if (!email || !password) {
        return next(new CustomError('please provide email and password', 400))
    }

    //get user from Db
    const user = await User.findOne({ email }).select("+password")

    if (!user) {
        return next(new CustomError('Invaild Credentails', 400))
    }

    //check password
    const isPasswordCorrect = await user.isValidPassword(password)

    if (!isPasswordCorrect) {
        return next(new CustomError('Invaild Credentails', 400))
    }

    //send jwt token to user 
    cookieToken(user, res)
})

exports.logout = BigPromise(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: "Logout success"
    })
})