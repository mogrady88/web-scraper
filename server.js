//Dependencies
var express = require("express");
var mongojs = require("mongojs");
var cheerio = require("cheerio");
var request = require("request");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");

var app = express();
var PORT = process.env.PORT || 8080;

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//mongo db instantiation
var databaseUrl = "reddit";
var collections = ["fantasyfootball"];
var db = mongojs(databaseUrl, collections);

var dbResults = [];
//web-scraping
function scrapeReddit(){
    request("https://old.reddit.com/r/fantasyfootball", function(error, res, html) {    
    
        var results = [];
        
        var $ = cheerio.load(html); 

    db.fantasyfootball.find({}, function(err, documents){
        if (err) throw err;
        // console.log(documents);
        for(var i = 0;i < documents.length; i++){
        dbResults.push(documents[i].title);
        }
        // console.log(dbResults);
    });


    $("p.title").each(function(i, element){
        var title = $(element).text();
        var link = $(element).children().attr("href");

        for (var i = 0;i < db.fantasyfootball.length; i++){
            if (title === dbResults[i]){
                return false;
            }
            else{
            results.push({
                title: title,
                link: link
                });
            }
    };
    });

    db.fantasyfootball.insert(results);
});
}

//db routes
db.on("error", function(error) {
    console.log("Database Error:", error);
  });

//api routes
app.get("/", function(req,res){
    scrapeReddit();
    // console.log("hello");
    db.fantasyfootball.find({}, function(err, data){
        if(err) throw err;
        var hbsObject = {
            posts: data
          };
        // console.log(data);
        res.render("index", hbsObject);
    });
});

app.listen(PORT, function() {
    console.log("Server listening on: http://localhost:" + PORT);
  });