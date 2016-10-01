var logger = require("connect-logger");
var errorHandler = require("errorhandler");
var _static = require("serve-static");

var path = require("path");
var http = require("http");

var express = require("express");
var app = express();

if(app.get("env") === "development") {
  app.use(logger());
  app.use(errorHandler());
}

app.use(_static(path.join(__dirname + "/public")));

var server = http.createServer(app).listen(process.env.PORT || 8080, (err) => {
  if(app.get("env") === "development") {
    if(err) {
      console.log(err);
    } else {
      console.log("Server listenin on port: " + server.address().port);
    }
  }
});
