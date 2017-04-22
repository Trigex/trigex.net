#!/usr/bin/env nodejs
var express = require("express");
var app = express();

var wordlist = require("./wordlist.json");

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
    res.render("projects");
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

app.get("/wordlist", function(req, res){
    res.json(wordlist);
});

// Start application
app.listen(8080, "127.0.0.1", function(){
    console.log("Listening on 127.0.0.1 at port 8080");
})
