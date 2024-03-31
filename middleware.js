const Listing = require("./models/listing");
const Review = require("./models/review");
const {listingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");


module.exports.isLoggedIn= (req,res,next)=>{
    if(!req.isAuthenticated()){
        //saved req.originalURL if user is not loggedin
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create listing!");
    return res.redirect("/login");
    }
    next();
};
//we did this req.session.redirectUrl because if we going to a path like edit or add listing then after login we go to same path instead of main page
//if we directly login without going to a path then it shows a error
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not owner of the listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validatelisting =  (req,res,next)=>{
    let {error}  = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else next();
};

module.exports.validateReview =  (req,res,next)=>{
    let {error}  = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    else next();
};

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let listing = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You didn't create this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};