var isValid = require("../validate-url.js");

module.exports = function(mongoClient) {
  return function(req, res) {
    var url = req.params.url;

    if(isValid(url)) {
      res.send("Valid url: " + url);
    }
    else {
      res.send("Invalid url!");
    }
  };
};
