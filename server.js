var http = require("http");
var express = require("express");
var mongodb = require("mongodb");

var app = express();

var server = http.createServer(app).listen(process.env.PORT || 8080, (err) => {
  if(err) {
    console.log(err);
  } else {
    console.log("Server listenin on port: " + server.address().port);
  }
});
