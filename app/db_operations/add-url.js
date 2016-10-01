var isValid = require("../validate-url.js");
var hash = require("../hash-url.js");

module.exports = function(mongoClient) {
  return function(req, res) {
    var url = req.params.url;

    if(isValid(url)) {
      // following:
      // 1. hash the url string
      // 2. lookup in the db if the hash already exists if yes send that entry else create a new entry
      // 3. send the entry with both urls (short and long)
    }
    else {
      res.json({
        error: "Invalid URL"
      });
    }
  };
};
