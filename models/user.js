const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    favoriteBook: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
});

//authenticate input against database documents
UserSchema.statics.authenticate = function(email, password,callback){
    User.findOne({email: email})
        .exec(function(err,user){
            if(err){
                return callback(err);
            }
            else if(!user){
                const err = new Error("User not found!");
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, user.password, function(error,result){
                if(result){
                    return callback(null,user);
                }
                else{
                    return callback();
                }
            })
    })
}

//hash password before saving to database
UserSchema.pre("save",function(next){
    const user = this;
    bcrypt.hash(user.password, 10 ,function (err,hash){
        if(err){
            return next(err);
        }
        else {
            user.password = hash;
            next();
        }
    });
});

const User = mongoose.model("User",UserSchema);
module.exports = User;