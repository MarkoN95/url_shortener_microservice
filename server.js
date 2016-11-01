var logger = require("connect-logger");
var errorHandler = require("errorhandler");
var _static = require("serve-static");
var favicon = require("express-favicon");

var add_url = require("./app/db_operations/add-url.js");
var lookup = require("./app/db_operations/lookup.js");
var serveDefault = require("./app/serve-default.js");

var path = require("path");
var http = require("http");

var express = require("express");
var app = express();

if(app.get("env") === "development") {
  app.use(logger());
  app.use(errorHandler());
}

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(_static(path.join(__dirname, "public")));

app.get("/new/:url(*)", add_url());
app.get("/:urlHash", lookup());

app.use(serveDefault());

http.createServer(app).listen(process.env.PORT || 8080);
