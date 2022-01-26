const User = require('../models/user')
const BigPromise = require('../middlewares/bigPromis')
const CustomError = require('../utils/CustomError')
const cookieToken = require('../utils/cookieToken')
const cloudinary = require('cloudinary').v2
const mailhelper = require('../utils/emailHelper')
const crypto = require('crypto')
const { token } = require('morgan')

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

exports.forgotPassword = BigPromise(async (req, res, next) => {
    const { email } = req.body

    //check exits user for that email
    const user = await User.findOne({ email })
    if (!user) {
        return next(new CustomError('Email not found as registered', 404))
    }

    const forgotToken = await user.getForgotPasswordToken()

    await user.save({ validateBeforeSave: false }) //not check validate bcz some data are not preset

    const forgotUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgotToken}`

    const message = `Copy paste this link or click this \n\n ${forgotUrl}`

    try {
        await mailhelper({
            emails: user.email,
            subject: "CodeX Password Reset Email",
            message
        })

        res.status(200).json({
            success: true,
            message: "Email sent successfully"
        })
    } catch (error) {
        user.forgotPasswordToken = undefined
        user.forgotPasswordExipary = undefined
        await user.save({ validateBeforeSave: false })
        return next(new CustomError(error.message, 500))
    }
})

exports.resetPassword = BigPromise(async (req, res, next) => {
    const token = req.params.token

    const encryToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        encryToken,
        forgotPasswordExipary: { $gt: Date.now() }
    })

    if (!user) {
        return next(new CustomError('Token in unvalid or expiry', 404))
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new CustomError('Password and confirm password do not match', 404))
    }
    user.password = req.body.password
    user.forgotPasswordToken = undefined
    user.forgotPasswordExipary = undefined
    await user.save()

    cookieToken(user, res)
})

exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {
    const user = req.user

    res.status(200).json({
        success: true,
        user
    })
})

exports.changePassword = BigPromise(async (req, res, next) => {
    const user = req.user

    const isCorrectOldPassword = await user.isValidPassword(req.body.oldPassword)

    if (!isCorrectOldPassword) {
        return new CustomError("Invalid Old Password", 404)
    }

    user.password = req.body.newPassword
    await user.save()

    cookieToken(user, res)
})

exports.updateUserDetails = BigPromise(async (req, res, next) => {

    const newData = {
        name: req.body.name,
        email: req.body.email
    };

    if (req.files) {
        const user = await User.findById(req.user.id)
        const imageId = user.photo.id

        //delete photo
        await cloudinary.uploader.destroy(imageId)

        let file = req.files.userPhoto

        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "users",
            width: 150,
            crop: "scale"
        })

        newData.photo = {
            id: result.public_id,
            secure_url: result.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })



    cookieToken(user, res)
})