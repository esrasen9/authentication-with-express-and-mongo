const express = require("express");
const router = express.Router();
const User = require("../models/user");
const middleware = require("../middleware");

router.get("/",middleware.loggedOut,(req,res,next)=>{
    res.render("signup",{title:"Signup"});
});

router.post("/",(req,res,next)=>{
    const {name, email, password, confirmPassword, favoriteBook} = req.body;
    if(email && name && password && confirmPassword && favoriteBook){
       if(password !== confirmPassword){
           const err = new Error("Passwords do not match!");
           err.status = 400;
           return next(err);
       }
       //create object with form input data
       const userData = {email,name,password,favoriteBook}
       //insert document into Mongo
       User.create(userData,(error,user)=>{
           if(error){
               return next(error);
           } else {
               req.session.userId = user._id;
               return res.redirect("/profile")
           }
       })
   }
   else {
       const err = new Error("All fields required!");
       err.status = 400;
       return next(err);
   }
});

module.exports = router;