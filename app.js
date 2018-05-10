var express = require("express");
var app = express();
var request = require("request");
var config = require("./config.json");

app.use(express.static("public"));
app.set("view engine", "ejs");

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
        console.log(body);
        res.render("projects", {projects: JSON.parse(body)});
    });
});

// Links page
app.get("/links", function(req, res){
    res.render("links");
});

// Blog page
app.get("/blog", function(req, res){
    res.render("blog");
});

// Admin page
app.get("/admin", function(req, res){
    res.render("admin");
});

/*
*   Blog API
*/

// Start application
app.listen(config.app.port, "127.0.0.1", function(){
    console.log("Listening on 127.0.0.1 at port " + config.app.port);
})
