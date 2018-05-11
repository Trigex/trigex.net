var express = require("express");
var app = express();
var request = require("request");
var mysql = require("mysql");
var session = require("express-session");
var bodyParser = require("body-parser");
var timestamp = require("time-stamp");
var config = require("./config.json");

app.use(express.static("public"));
app.set("view engine", "ejs");

// session
app.use(session({
    secret: config.app.session.secret,
    duration: 30 * 60 * 1000,
    httpOnly: true,
    secure: true,
    ephemeral: true
}));

// get body of post request
app.use(bodyParser.urlencoded({extended: true}));

// init mysql
var connection = mysql.createConnection({
    host: config.app.mysql.host,
    user: config.app.mysql.user,
    password: config.app.mysql.password,
    database: config.app.mysql.database
});

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
app.get("/blog", function(req, res){
    connection.query("SELECT * FROM post", function(error, results, fields){
        res.render("blog", {posts: results});
    });
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
app.post("/blog/create/post", function(req, res){
    var title = req.body.title;
    var content = req.body.content;
    var time = timestamp();
    connection.query("INSERT INTO post (timestamp, title, content) VALUES ('"+time+"','"+title+"','"+content+"');", function(error, results, fields){
        if(error) throw error;

        res.redirect("/admin");
    });
});

app.post("/blog/delete/post", function(req, res){
    var id = req.body.id;
    connection.query("DELETE FROM post WHERE id = " + id, function(error, results, fields){
        if(error) throw error;

        res.redirect("/admin");
    });
});

// Start application
app.listen(config.app.port, "127.0.0.1", function(){
    console.log("Listening on 127.0.0.1 at port " + config.app.port);
})
