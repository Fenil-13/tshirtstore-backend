const express = require('express')
const router = express.Router()
const {
    signup,
    login,
    logout,
    forgotPassword,
    resetPassword,
    getLoggedInUserDetails,
    changePassword,
    updateUserDetails,
    adminAllUsers,
    manageAllUsers,
    adminGetOneUser,
    adminUpdateUserDetails,
    adminDeleteUserDetails
} = require('../controller/userController')
const { isLoggedIn, customRole } = require("../middlewares/user")

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forgotPassword').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);
router.route('/userdashboard').get(isLoggedIn, getLoggedInUserDetails);
router.route('/password/update').get(isLoggedIn, changePassword);
router.route('/userdashboard/update').post(isLoggedIn, updateUserDetails);


router.route('/admin/users').get(isLoggedIn, customRole('manager'), adminAllUsers);
router.route('/manager/users').get(isLoggedIn, customRole('manager'), manageAllUsers);
router.route('/admin/users/:id')
    .get(isLoggedIn, customRole('admin'), adminGetOneUser)
    .put(isLoggedIn, customRole('admin'), adminUpdateUserDetails)
    .delete(isLoggedIn, customRole('admin'), adminDeleteUserDetails);

module.exports = router