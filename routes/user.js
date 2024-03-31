const express = require("express");
const router = express.Router();//to pass from parent to child
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");

router
.route("/signup")
//rendersignup
.get(userController.renderSignup)
//we add req.login() in signup because we want user automatically login after signup
.post(wrapAsync(userController.signup));


router
.route("/login")
//renderlogin
.get(userController.renderLogin)
//Login route
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),
userController.Login);

//logout
router.get("/logout",userController.Logout);
module.exports = {router};