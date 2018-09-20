//Dependencies
var express = require("express");
var cheerio = require("cheerio");
var request = require("request");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");

var app = express();
var PORT = process.env.PORT || 8080;
app.use(express.static("public"));


app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// mongoose.connect("mongodb://localhost/reddit", { useNewUrlParser: true });
var db = require("./models");
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/reddit";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

//web-scraping
function scrapeReddit(){
    request("https://old.reddit.com/r/fantasyfootball", function(error, res, html) {    
    
        var $ = cheerio.load(html); 

    var likes = [];
    var postInfo = [];
    var results = [];

    $("div.likes").each(function(i, element) {
        var upvotes = $(element).text();
        // console.log(upvotes);
        likes.push({
            upvotes: upvotes
        });
    });
    // console.log(results);

    $("p.title").each(function(i, element){
        var title = $(element).text();
        var link = $(element).children().attr("href");

        postInfo.push({
            title: title,
            link: link
            });
    });
    
    for (i = 0; i < likes.length; i++) {
        results.push({
            upvotes: likes[i].upvotes,
            title: postInfo[i].title,
            link: postInfo[i].link
        });
    }

    // console.log(results);

    db.Post.create(results)
        .then(function(dbPost) {
        //   console.log(dbPost);
        })
        .catch(function(err) {
          return res.json(err);
        });
});
}

//api routes

//WEB SCRAPE TO DB AND POST ALL ARTICLES
app.get("/", function(req,res){
    scrapeReddit();
    // console.log("hello");
    db.Post.find({})
    .then(function(dbPost) {
      var hbsObject = {
        posts: dbPost
      };
    //   console.log(hbsObject);
      res.render("index", hbsObject);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//LOAD COMMENTS
app.get("/comments/:id", function (req,res){
    console.log("load comments");
    console.log(req.params.id);
    db.Comment.find({postnum: req.params.id}).then(function(dbComments){
        console.log(dbComments)
        res.json(dbComments);
    })
    .catch(function(err) {
        res.json(err);
      });
});

//POST COMMENTS
app.post("/post/:id", function(req, res) {
    console.log("post comments");
    console.log(req.body);
    db.Comment.create(req.body)
      .then(function(dbComment) {
        console.log(dbComment);
        res.json(dbComment);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

//DELETE COMMENTS
app.delete("/delete/:id", function(req,res) {
    console.log("delete comments");
    console.log(req.params);
    db.Comment.remove({_id:req.params.id})
    .then(function(dbDeleted){
        res.json(dbDeleted);
    });
});
app.listen(PORT, function() {
    console.log("Server listening on: http://localhost:" + PORT);
  });