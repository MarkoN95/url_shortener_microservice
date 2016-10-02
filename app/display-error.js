module.exports = function(type) {
  switch(type) {
  case "db":
    return {
      error: "Sorry there was an error with our database. Please try again later"
    };
  }
};
