var mongodb = require("mongodb");
var displayError = require("../display-error.js");

var default_url = "mongodb://localhost:27017/url-shortener";

function checkHash(hash) {
  if(hash.charAt(0) === "0") {
    hash = hash.replace("0", "-");
  }
  if(isNaN(Number(hash))) {
    return false;
  }
  return true;
}

module.exports = function() {
  return function(req, res) {
    var urlHash = req.params.urlHash;

    if(checkHash(urlHash)) {

      mongodb.MongoClient.connect(process.env.MONGOLAB_URI || default_url, { auto_reconnect: true }, (err, db) => {
        if(err) {
          res.send(displayError("db", err));
          return;
        }
        db.collection("url-hashes", (err, collection) => {
          collection.find({ key: urlHash }, { key: 0, _id: 0 }).toArray((err, docs) => {
            if(err) {
              res.send(displayError("db", err));
              db.close();
              return;
            }
            //the hash is not in the db
            if(docs.length === 0) {
              res.json({
                error: "Sorry we coudn't find a matching url in our database"
              });
              db.close();
            }
            //hash is in the db
            else {
              res.redirect(docs[0].original_url);
              db.close();
            }
          });
        });
      });
    }
    else {
      res.send({
        error: "You have to specifiy a url to be shortened"
      });
    }
  };
};
