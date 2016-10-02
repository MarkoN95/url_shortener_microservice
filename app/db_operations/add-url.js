var mongodb = require("mongodb");
var displayError = require("../display-error.js");

var isValid = require("../validate-url.js");
var hash = require("../hash-url.js");

var default_url = "mongodb://localhost:27017/url-shortener";

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

      mongodb.MongoClient.connect(process.env.MONGOLAB_URI || default_url, { auto_reconnect: true }, (err, db) => {
        if(err) {
          res.send(displayError("db", err));
          return;
        }
        db.collection("url-hashes", (err, collection) => {
          if(err) {
            res.send(displayError("db", err));
            db.close();
            return;
          }
          collection.find({ key: negative_to_zero(key) }, { key: 0, _id: 0 }).toArray((err, docs) => {
            if(err) {
              res.send(displayError("db", err));
              db.close();
              return;
            }
            //url doesn't exist in db yet
            if(docs.length === 0) {

              var url_pair = {
                key: negative_to_zero(key),
                original_url: url,
                short_url: ("https://tiny-url.herokuapp.com/" + negative_to_zero(key)
              };

              collection.insert(url_pair, (err, result) => {
                if(err) {
                  res.send(displayError("db", err));
                  db.close();
                  return;
                }
                res.json({
                  original_url: url_pair.original_url,
                  short_url: url_pair.short_url
                });
                db.close();
              });
            }
            //url already exist's in db
            else {
              res.json(docs[0]);
              db.close();
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
