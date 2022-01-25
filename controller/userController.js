const User = require('../models/user')
const BigPromise = require('../middlewares/bigPromis')
const CustomError = require('../utils/CustomError')
const cookieToken = require('../utils/cookieToken')
const fileUpload = require('express-fileupload')
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