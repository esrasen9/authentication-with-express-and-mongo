const express = require('express');
const router = express.Router();

router.get("/",(req, res, next)=>{
    if(req.session){
        //delete session
        req.session.destroy((err)=>{
            if(err){
                return next(err);
            }
            else {
                return res.redirect("/");
            }
        });
    }
});

module.exports = router;