var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/country_app");

module.exports.User = require("./user"); // adding an extra export for the file puppy
module.exports.Country = require("./country");
