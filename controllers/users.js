const User = require("../models/user.js");

//signup from render
module.exports.renderSignupFrom = (req,res)=>{
    res.render("./users/signup.ejs")
};


//signup post method
module.exports.signup = async (req, res)=>{
    try{
        let {username,email ,password} = req.body;
        const newUser = new User({username, email})
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wonderlust");
            res.redirect("/listing");
        })
       
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};


//login form 
module.exports.renderLoginFrom = (req,res)=>{
    res.render("./users/login.ejs")
};

//login post method
module.exports.login = async (req, res)=>{
    req.flash("success","Welcome back to Wonderlust");
    let redirctUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirctUrl);
};

//logout
module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listing");
    })
};