var mongodb = require("mongodb");
var displayError = require("../display-error.js");

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
      var server = new mongodb.Server("localhost", 27017, { auto_reconnect: true });
      var DB = new mongodb.Db("url-shortener", server);

      DB.open((err, db) => {
        if(err) {
          res.send(displayError("db"));
          db.close();
          return;
        }
        db.collection("url-hashes", (err, collection) => {
          collection.find({ key: urlHash }, { key: 0, _id: 0 }).toArray((err, docs) => {
            if(err) {
              res.send(displayError("db"));
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
