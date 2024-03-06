const express = require("express");
passport = require("passport"),
bodyParser = require("body-parser"),
LocalStrategy = require("passport-local"),
passportLocalMongoose = 
    require("passport-local-mongoose")
const User = require("./model/User");
// import the mongoose database  connection string 
require("./config");
let app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: "sunil is a ligdi ",
    resave: false,
    saveUninitialized: false
}));
 
app.use(passport.initialize());
app.use(passport.session());
 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// Showing home page
app.get("/", function (req, res) {
    res.render("home");
});



// Show the Register Form   
app.get("/register",function(req,res){
  res.render("register")
})

// Register the data in the db 
app.post("/register",async (req,res)=>{
  const data={
    username:req.body.username,
    password:req.body.password
  }
  await User.insertMany([data])
  res.render("home")
})



//Showing login form
app.get("/login", function (req, res) {
    res.render("login");
});


// login form 
app.post("/dashboard", async function(req, res){
    try {
        // check if the user exists
        const user = await User.findOne({ username: req.body.username });
        if (user) {
          //check if password matches
          const result = req.body.password === user.password;
          if (result) {
            res.render("dashboard");
          } else {
            res.status(400).json({ error: "password doesn't match" });
          }
        } else {
          res.status(400).json({ error: "User doesn't exist" });
        }
      } catch (error) {
        res.status(400).json({ error });
      }
});

// Showing secret page
app.get("/dashboard", isLoggedIn, function (req, res) {
  res.render("dashboard");
});


 
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

//Handling user logout 
app.get("/logout", function (req, res) {
  req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});



let port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!"+ port);
});
 