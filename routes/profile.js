const express = require("express");
const router = express.Router();
const User = require("../models/user");
const middleware = require("../middleware");

router.get("/",middleware.requiresLogin,(req,res,next)=>{
    if(! req.session.userId){
        const err = new Error("You are not authorized to view this page!");
        err.status = 403;
        return next(err);
    }
    User.findById(req.session.userId)
        .exec(function(error,user){
            if(error){
                return next(error);
            }
            else {
                return res.render("profile",{title:"Profile",name:user.name,favorite: user.favoriteBook});
            }
        });
});

module.exports = router;