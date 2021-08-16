const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session  = require("express-session");
const MongoStore = require("connect-mongo");

mongoose.connect("mongodb://localhost:27017/goodreads",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',() => console.log("Conected to MongoDB!"));

//used MongoDB as a session store
app.use(session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: "mongodb://localhost:27017/goodreads"
    })
}));

//make userId available
app.use((req, res, next) =>{
    res.locals.currentUser = req.session.userId;
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine","pug");

//Routes
const signUpRouter = require("./routes/signup");
const aboutRouter = require("./routes/about");
const contactRouter = require("./routes/contact");
const profileRouter = require("./routes/profile");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");
app.use("/signup",signUpRouter);
app.use("/about",aboutRouter);
app.use("/contact",contactRouter);
app.use("/profile",profileRouter);
app.use("/login",loginRouter);
app.use("/logout",logoutRouter);

app.use('/', (req, res)=>{
    res.render("home",{title: "Goodreads"});
});

app.use((err,req,res,next)=>{
    res.status(err.status || 500);
    res.render("error",{
        message: err.message,
        error: {}
    })
});

app.listen(PORT,()=>{
    console.log(`This app is running on http://localhost:${PORT}`);
});