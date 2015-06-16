var db = require("../models"); // database will gather information from the models folder

var routeHelpers = { // making sure that the user is logged in
	ensureLoggedIn: function(req, res, next) {
		// checking here to see if there's any value in the session ID
		if (req.session.id !== null && req.session.id !== undefined) {
			return next();
		}
		 else {
		 	res.redirect('/login'); // if there is a value in session.id, redirected to login page?
	}
},

	ensureCorrectUser: function(req, res, next) {
		// I'm not sure if I should have Country as singular or plural word?
		db.Country.findById(req.params.id, function(err, countries) { // confused with the use of countries here
			if (countries.ownerId !== req.session.id) { // country or countries?
				res.redirect('/countries'); // this countries is correct bc one of my routes is countries
			}
			else {
				return next();
			}
		});
	},

	preventLoginSignup: function(req, res, next) {
		if (req.session.id !== null && req.session.id !== undefined) {
			res.redirect('/countries');
		}
		else {
			return next();
		}
	}
};

module.exports = routeHelpers;
