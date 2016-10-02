module.exports = function(type, e) {
  switch(type) {
  case "db":
    return {
      message: "Sorry there was an error with our database. Please try again later",
      error: e
    };
  }
};
