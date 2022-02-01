const Product = require('../models/product')
const BigPromise = require('../middlewares/bigPromis')
const cloudinary = require('cloudinary').v2
const WhereClause = require('../utils/whereClause')
const CustomError = require('../utils/CustomError')

exports.addProduct = BigPromise(async (req, res, next) => {
    //images
    let imageArray = []
    console.log(req.files)
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

exports.getOneProduct = BigPromise(async (req, res, next) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        return next(new CustomError('No Product Found', 401))
    }


    res.status(200).json({
        success: true,
        product
    })
})

exports.addReview = BigPromise(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    const product = await Product.findById(req.body.id)

    if (!product) {
        return next(new CustomError('No Product Found', 401))
    }

    const alreadyReview = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    )

    if (alreadyReview) {
        product.reviews.forEach((review) => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating
            }
        });
    } else {
        product.reviews.push(review)
        product.numberOfReviews = product.reviews.length
    }

    //adjust rating
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0)
        / product.reviews.length;

    //save
    await product.save({
        validateBeforeSave: false
    })

    res.status(200).json({
        success: true,
        product
    })
})


//admin only code
exports.adminGetAllProduct = BigPromise(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    })
})

exports.adminUpdateOneProduct = BigPromise(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new CustomError('No Product Found', 401))
    }

    let imageArray = []

    if (req.files) {
        //destroy exitisting images

        for (let index = 0; index < product.photos.length; index++) {
            const result = await cloudinary.uploader.destroy(product.photos[index].id)
        }

        //upload and save the images

        for (let index = 0; index < req.files.photos.length; index++) {
            let result = await cloudinary.uploader.upload(req.files.photos[index].tempFilePath, {
                folder: "products"
            })

            imageArray.push({
                id: result.public_id,
                secure_url: result.secure_url
            })
        }
    }


    req.body.photos = imageArray
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })


    res.status(200).json({
        success: true,
        product
    })
})

exports.adminDeleteOneProduct = BigPromise(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new CustomError('No Product Found', 401))
    }

    //destroy exitisting images

    for (let index = 0; index < product.photos.length; index++) {
        await cloudinary.uploader.destroy(product.photos[index].id)
    }

    await product.remove()

    res.status(200).json({
        success: true,
        message: "Product was deleted !"
    })
})