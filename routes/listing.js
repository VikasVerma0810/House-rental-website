const express = require('express');
const router =express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


// index route
router.get("/",wrapAsync(listingController.index));


// create new listing route
router.get("/new",isLoggedIn, listingController.renderNewFrom);

router.post("/",isLoggedIn,  upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));


// update route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync( listingController.renderUpdateForm));

router.put("/:id",isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync( listingController.updateListing));


// delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync( listingController.deleteListing));

// show route
router.get("/:id",wrapAsync( listingController.showListing));


module.exports = router;