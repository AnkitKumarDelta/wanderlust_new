const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.show = async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id).populate({path : "review",populate:{path:"author",},}).populate("owner");//path ka matllab hum kiske sath populate krna chahte hain isme hum review ke sath krna chahte hain
    if(!listing){
        req.flash("error","listing you requested for doesnot exist");
        res.redirect("/listings");
    }
res.render("listings/show.ejs",{listing});
};

module.exports.createpost = async(req,res,next)=>{
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  })
    .send()
  
    let url = req.file.path;
    let filename = req.file.filename;
    // let{title,description,image,price,country,location} = req.body;
 //     let list1 = new Listing({
 //         title: title,
 //        description: description,
 //        qimage: image,
 //         price: price,
 //         country:country,
 //         location:location,
 //     }); 
 //     list1.save()
 //     .then((res)=>{
 // console.log("chat was saved");
 //     })
 //     .catch((err)=>{
 //         console.log(err);
 //     });
 //above is also a method to add documents from from to list
 //below is also a method for same by making all input fields of a from an object
 
 let newlisting = new Listing(req.body.listing);
 newlisting.owner = req.user._id;//passport saved user info in _id is id of unique user
 newlisting.image={url,filename};
 newlisting.geometry = response.body.features[0].geometry;

 await newlisting.save();
 
 req.flash("success","new listing added");
     res.redirect("/listings");
 };

 module.exports.edit = async(req,res)=>{
    let {id} = req.params;
   const listing = await Listing.findById(id);
   if(!listing){
    req.flash("error","listing you are requested for does not exist");
    res.redirect("/listings");
   }
   let originalImageUrl = listing.image.url;
   originalImageUrl = originalImageUrl.replqce("/upload","/upload/h_300,w_250");
   //the above is done to change the quality of image to preview in edit.ejs
 res.render("listings/edit.ejs",{listing,originalImageUrl});
 };

 module.exports.update = async(req,res)=>{
    let {id} = req.params;
  let listing =   await Listing.findByIdAndUpdate(id,{...req.body.listing});
  if(typeof req.file !== "undefined"){
  let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename} ;
    await listing.save();
  }
    req.flash("success","listing uploaded");
  res.redirect(`/listings/${id}`);
};

module.exports.destroy = async(req,res)=>{
    let {id} = req.params;
await Listing.findByIdAndDelete(id);
res.redirect("/listings");
};


