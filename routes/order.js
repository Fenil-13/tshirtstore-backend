const express = require('express')
const { isLoggedIn, customRole } = require('../middlewares/user')
const { createOrder,
    getOneOrder,
    getLoggedInOrders,
    adminGetAllOrders,
    adminUpdateOrder,
    adminDeleteOrder } = require('../controller/orderController')
const router = express.Router()

router.route("/order/create").post(isLoggedIn, createOrder);
router.route("/order/:id").get(isLoggedIn, getOneOrder);
router.route("/myorder").get(isLoggedIn, getLoggedInOrders);

//admin routes
router.route("/admin/orders").get(isLoggedIn, customRole('admin'), adminGetAllOrders);
router.route("/admin/orders/:id").put(isLoggedIn, customRole('admin'), adminUpdateOrder)
    .delete(isLoggedIn, customRole('admin'), adminDeleteOrder);
module.exports = router