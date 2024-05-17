const express = require('express');
const router =express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require('passport');
const {saveRedirectUrl} = require("../middleware.js")

const userController = require("../controllers/users.js");

// signup
router.get("/signup",userController.renderSignupFrom)

router.post("/signup",wrapAsync(userController.signup));


// login
router.get("/login",userController.renderLoginFrom)

router.post("/login",saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/login", failureFlash:true}), wrapAsync(userController.login));

// logout
router.get("/logout",userController.logout)


module.exports = router;