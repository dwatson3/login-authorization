var mongoose = require("mongoose");

var countrySchema = new mongoose.Schema({ // creating a new Schema 
  name: String,
  flag: String,
  capital: String,
  population: Number,
  cities: []
});

var Country = mongoose.model("Country", countrySchema); // creating a new Model

module.exports = Country;