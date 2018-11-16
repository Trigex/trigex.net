var express = require("express");
var app = express();
var request = require("request");
var session = require("express-session");
var bodyParser = require("body-parser");
var timestamp = require("time-stamp");
var config = require("./config.json");
var mongoose = require("mongoose");
var post = require("./post");

app.use(express.static("public"));
app.set("view engine", "ejs");

// session
app.use(session({
    secret: config.app.session.secret,
    duration: 253402300000000,
    httpOnly: true,
    secure: true,
    ephemeral: true
}));

// get body of post request
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://" + "127.0.0.1" + ":" + "27017" + "/" + "trigex", {useNewUrlParser: true});

// Home page
app.get("/", function(req, res){
    res.render("home");
});

app.get("/home", function(req, res){
    res.render("home");
});

// About page
app.get("/about", function(req, res){
    res.render("about");
});

// Projects page
app.get("/projects", function(req, res){
    var projects = request({url: "https://api.github.com/users/trigex/repos", headers:{'User-Agent': 'request'}}, function (error, response, body){
        res.render("projects", {projects: JSON.parse(body)});
    });
});

// Links page
app.get("/links", function(req, res){
    res.render("links");
});

// Blog page
app.get("/blog", async function(req, res){
    try {
        var posts = await post.find({});
        res.render("blog", {posts: posts});
    } catch(err) {
        console.log(err);
    }
});

// Admin page (for creating blog entries)
app.get("/admin", function(req, res){
    if(req.session.admin === true) {
        res.render("admin_panel");
    } else {
        res.render("admin")
    }
});

app.post("/admin/auth", function(req, res){
    if(req.body.password === config.app.admin_password) {
        req.session.admin = true;
        res.redirect("/admin")
    } else {
        res.redirect("/");
    }
});

/*
*   Blog API
*/
app.post("/blog/create/post", async function(req, res){
    var title = req.body.title;
    var content = req.body.content;
    var time = timestamp();
    try {
        await post.create({title: title, content: content, timestamp: time});
        res.send(JSON.stringify({status: "posted"}));
    } catch(err) {
        console.log(err);
    }
});

app.post("/blog/delete/post", async function(req, res){
    var id = req.body.id;
    try {
        await post.findOneAndDelete({_id: id});
        res.send(JSON.stringify({status: "deleted"}))
    } catch(err) {
        console.log(err);
    }
});

// Start application
app.listen(config.app.port, "127.0.0.1", function(){
    console.log("Listening on 127.0.0.1 at port " + config.app.port);
})
