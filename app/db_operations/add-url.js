var mongodb = require("mongodb");
var displayError = require("../display-error.js");

var isValid = require("../validate-url.js");
var hash = require("../hash-url.js");

function negative_to_zero(str) {
  var n = Number(str);
  if(n < 0) {
    return str.replace("-", "0");
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
          collection.find({ key: negative_to_zero(key) }, { key: 0, _id: 0 }, (err, docs) => {
            if(err) {
              res.send(displayError("db"));
              return;
            }
            //url doesn't exist in db yet
            if(docs.length === 0) {

              var url_pair = {
                key: negative_to_zero(key),
                original_url: url,
                short_url: "http://myproject.com/" + negative_to_zero(key)
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
              res.json(docs[0]);
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
