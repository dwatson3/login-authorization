mkdir var db = require("../models"); // making a diretory db that is requiring the models folder

var loginHelpers = function (req, res, next) { // next means that its sending it to the server

// var loginMiddleware = function (req, res, next) {
// loginMiddleware is a function	

	req.login = function (user) { 
		req.session.id = user._id; // requiring a user id to log-in
	};

	req.logout = function() { // the session.id or the user must be equal to null to ensure successful logout?
		req.session.id = null; 
		req.user = null;
	};

	next(); // important to have next in the middleware
};

module.exports = loginHelpers;

// app.use(loginMiddleware)