const Product = require('../models/product')
const BigPromise = require('../middlewares/bigPromis')



exports.testProduct = BigPromise(async (req, res, next) => {
    res.json({
        success: true
    })
})