const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate'); 
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js")

const port = 8080;

// connecting to database
main()
    .then(()=>{
        console.log("Connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    })

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    // console.log(result); 
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

// routes
app.get("/",(req, res)=>{
    res.send("hi kem chho");
})


// index route
app.get("/listing",wrapAsync(async (req, res)=>{
    let allListings = await Listing.find({});
    // console.log(result);
    res.render("./listings/index.ejs",{allListings});

}));



// create new listing route
app.get("/listing/new", (req, res)=>{
    res.render("./listings/new.ejs");
});

app.post("/listing",validateListing, wrapAsync(async (req, res)=>{
    let listing = req.body.listing;
    const newListing = new Listing(listing);
    await newListing.save();
    res.redirect("/listing");
}));


// update route
app.get("/listing/:id/edit",wrapAsync( async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    // console.log(listing);
    res.render("./listings/edit.ejs",{listing});
}));

app.put("/listing/:id",validateListing, wrapAsync( async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    // console.log("hello");
    res.redirect("/listing");
}));


// delete route
app.delete("/listing/:id",wrapAsync( async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));

// show route
app.get("/listing/:id",wrapAsync( async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
}));




app.all("*",(req, res ,next)=>{
    next(new ExpressError(404, "Page not found"));
})

app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something went wrong"}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("./listings/error.ejs",{statusCode, message});
})



app.listen(port,()=>{
    console.log(`Listening on ${port}`);
});