var mongodb = require("mongodb");

var isValid = require("../validate-url.js");
var hash = require("../hash-url.js");

function displayError(type) {
  switch(type) {
  case "db":
    return "There was an error with our database. Please try again later";
  }
}

function zeroFill(str) {
  var n = Number(str);
  if(n < 0) {
    return "0" + str;
  }
  return str;
}

module.exports = function() {
  return function(req, res) {

    var url = req.params.url;
    var key = hash(url);

    if(isValid(url)) {

      var server = new mongodb.Server("localhost", 27017, { auto_reconnect: true });
      var DB = new mongodb.Db("url-shortener", server);

      DB.open((err, db) => {
        if(err) {
          res.send(displayError("db"));
          return;
        }
        db.collection("url-hashes", (err, collection) => {
          if(err) {
            res.send(displayError("db"));
            return;
          }
          collection.find({ key: zeroFill(key) }, (err, docs) => {
            if(err) {
              res.send(displayError("db"));
              return;
            }
            //url doesn't exist in db yet
            if(docs.length === 0) {
              
              var url_pair = {
                key: key,
                original_url: url,
                short_url: "http://myproject.com/" + zeroFill(key)
              };

              collection.insert(url_pair, (err, result) => {
                if(err) {
                  res.send(displayError("db"));
                  return;
                }
                res.json({
                  original_url: url_pair.original_url,
                  short_url: url_pair.short_url
                });
              });
            }
            //url already exist's in db
            else {
              res.json({
                original_url: docs[0].original_url,
                short_url: docs[0].short_url
              });
            }
          });
        });
      });
    }
    else {
      res.json({
        error: "Invalid URL"
      });
    }
  };
};
