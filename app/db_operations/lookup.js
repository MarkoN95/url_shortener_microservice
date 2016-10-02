var mongodb = require("mongodb");
var displayError = require("../display-error.js");

module.exports = function() {
  return function(req, res) {
    var urlHash = req.params.urlHash;

    var server = new mongodb.Server("localhost", 27017, { auto_reconnect: true });
    var DB = new mongodb.Db("url-shortener", server);

    DB.open((err, db) => {
      if(err) {
        res.send(displayError("db"));
        return;
      }
      db.collection("url-hashes", (err, collection) => {
        collection.find({ key: urlHash }, { key: 0, _id: 0 }, (err, docs) => {
          if(err) {
            res.send(displayError("db"));
            return;
          }
          //the hash is not in the db
          if(docs.length === 0) {
            res.json({
              error: "Sorry we coudn't find a matching url in our database"
            });
          }
          //hash is in the db
          else {
            res.redirect(docs[0].original_url);
          }
        });
      });
    });
  };
};
