module.exports = function(url) {
  if(!url) {
    return false;
  }
  //parse_url from: Douglas Crockford - JavaScript The Good Parts
  var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
  var result = parse_url.exec(url);

  if((result[1] === "http" || result[1] === "https") && result[2] === "//" && result[3].split(".")[0] === "www") {
    return true;
  }
  else {
    return false;
  }
};
