const Order = require('../models/order')
const product = require('../models/product')
const BigPromise = require('../middlewares/bigPromis')
const CustomError = require('../utils/CustomError')
const cookieToken = require('../utils/cookieToken')


exports.createOrder = BigPromise(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        taxAmount,
        shippingAmount,
        totalAmount
    } = req.body

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        taxAmount,
        shippingAmount,
        totalAmount,
        user: req.user._id
    })

    res.status(200).json({
        success: true,
        order
    });
})