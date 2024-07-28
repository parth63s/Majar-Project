const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsyc.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// index route
router.get(
    "/",
    wrapAsync(async (req,res) => {
        const allListings = await Listing.find({});
        res.render("listing/index.ejs", {allListings});
    })
);


//new route
router.get("/new", (req,res) =>{
    res.render("listing/new.ejs");
});

// show route
router.get("/:id", wrapAsync(async (req, res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listing/show.ejs", {listing});
}));

// Create Route
router.post("/",validateListing, wrapAsync(async (req, res, next)=> {
    const newListing = new Listing(req.body.listing);
    
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));


// Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    // console.log(listing)
    res.render("listing/edit.ejs", {listing});
}));


// update Route
router.put("/:id",validateListing, wrapAsync( async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}))


// delete route
router.delete("/:id",wrapAsync( async (req, res) => {
    let{id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}))

module.exports = router