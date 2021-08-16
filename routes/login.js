const express = require("express");
const router = express.Router();
const User = require("../models/user");
const middleware = require("../middleware");

router.get("/",middleware.loggedOut,(req,res)=>{
    res.render("login",{title:"Log In"});
});

router.post("/",(req,res,next)=>{
    const {email,password} = req.body;
    if(email && password){
        User.authenticate(email,password,function(error,user){
            if(error || !user){
                const err = new Error("Wrong email or password!");
                err.status = 401;
                return next(err);
            }
            else {
                req.session.userId = user._id;
                return res.redirect("/profile");
            }
        });
    }
    else {
        const err = new Error("Email and password are required!");
        err.status = 400;
        return next(err);
    }
});

module.exports = router;