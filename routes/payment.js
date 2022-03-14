const express = require('express')
const { isLoggedIn, customRole } = require('../middlewares/user')
const { sendStripeKey, sendRazorpayKey, captureStripePayment, captureRazorpayPayment } = require('../controller/paymentController')
const router = express.Router()

router.route("/stripekey").get(sendStripeKey);
router.route("/razorpayKey").get(sendRazorpayKey);

router.route("/capturestripe").get(isLoggedIn, captureStripePayment);
router.route("/capturerazorpay").get(isLoggedIn, captureRazorpayPayment);

module.exports = router