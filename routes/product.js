const express = require('express')
const { addProduct, getAllProduct } = require('../controller/productController')
const { isLoggedIn, customRole } = require('../middlewares/user')
const router = express.Router()


//user routes=
router.route("/products").get(getAllProduct);

//admin routes
router
    .route("/admin/product/add")
    .post(isLoggedIn, customRole("admin"), addProduct);


module.exports = router