const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

//flah is use to show message
//work of session is to store useful informations in a single session so that we use it on different pages

app.set("views",path.join(__dirname,"views"));
  app.set("view engine","ejs");

//app.use(session({secret:mysecretsession}));
const sessionOptions = {
    secret:"mysecretstring",
    resave:false,
    saveUninitialized:true,
};

app.use(session(sessionOptions));
app.use(flash());

app.get("/register",(req,res)=>{
let {name = "anonymous"} = req.query;
req.session.name=name;
if(name==="anonymous"){
    req.flash('error','user not registered ');
}
else{
    req.flash('success','user registered successfully');
}
res.redirect("/hello");
});
//res.locals is another method for flash the messages
app.get("/hello",(req,res)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
res.render("page.ejs", {name:req.session.name});
});

app.get("/test",(req,res)=>{
    res.send("test succesfull");
});

app.use(cookieParser("secretcode"));

app.get("/getssignedcookie",(req,res)=>{
    res.cookie("made-in","India",{signed:true});
    res.send("signed cookie send");
});

app.get("/verify",(req,res)=>{
    console.log(req.signedCookies);
    res.send("verified");
});

app.get("/greet",(req,res)=>{
    let {name = 'anonymous'}= req.cookies;
    res.send(`hi,${name}`);
});

app.get("/getcookies",(req,res)=>{
    res.cookie("greet","hello");
    res.cookie("madein","India");
    res.send("sent you some cookies");
});

app.get("/",(req,res)=>{
    res.send("hi im root");
});

app.listen(3000,()=>{
    console.log("server is listening on port no 3000");
});
app.use("/users",users);
app.use("/posts",posts);

