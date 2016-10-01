module.exports = function(url) {
  if(typeof url !== "string") {
    return {
      error: "typeof argument must be a string"
    };
  }
  var hash = 0, char = 0;
  if(url.length === 0) {
    return hash;
  }
  for(var i = 0; i < url.length; i++) {
    char = url.charCodeAt(i);
    hash =((hash << 5) - hash) + char;
    hash = hash & hash; //convert to 32-bit integer
  }
  return hash.toString();
};
