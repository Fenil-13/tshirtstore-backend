const express = require('express')
const { isLoggedIn, customRole } = require('../middlewares/user')
const { createOrder } = require('../controller/orderController')
const router = express.Router()

router.route("/order/create").post(isLoggedIn, createOrder);
module.exports = router