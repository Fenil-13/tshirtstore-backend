const Product = require('../models/product')
const BigPromise = require('../middlewares/bigPromis')
const cloudinary = require('cloudinary').v2
const WhereClause = require('../utils/whereClause')

exports.addProduct = BigPromise(async (req, res, next) => {
    //images
    let imageArray = []

    if (!req.files) {
        return next(new CustomError('Picture required', 400))
    }

    for (let index = 0; index < req.files.photos.length; index++) {
        let result = await cloudinary.uploader.upload(req.files.photos[index].tempFilePath, {
            folder: "products"
        })

        imageArray.push({
            id: result.public_id,
            secure_url: result.secure_url
        })
    }

    req.body.photos = imageArray
    req.body.user = req.user.id


    const product = await Product.create(req.body)

    res.status(200).json({
        success: "true",
        product
    })
})

exports.getAllProduct = BigPromise(async (req, res, next) => {
    const resultPerPage = 6
    const totalcountProduct = await Product.countDocuments()

    const productObj = new WhereClause(Product.find(), req.query)
        .search()
        .filter()

    let products = await productObj.base
    const filteredProductNumber = products.length

    productObj.pager(resultPerPage)
    products = await productObj.base.clone()

    res.status(200).json({
        success: true,
        products,
        filteredProductNumber,
        totalcountProduct
    })

})