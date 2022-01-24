const User = require('../models/user')
const BigPromise = require('../middlewares/bigPromis')
const CustomError = require('../utils/CustomError')
const cookieToken = require('../utils/cookieToken')


exports.signup = BigPromise(async (req, res, next) => {
    const { name, email, password } = req.body

    if (!email || !password || !name) {
        return next(new CustomError('Name,password and email are required', 400))
    }

    const user = await User.create({
        name,
        email,
        password
    })

    cookieToken(user, res)


})