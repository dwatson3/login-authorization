var bcrypt = require("bcrypt"); // this is for adding and salting passwords
// why is SALT_WORK_FACTOR all capitalized?
var SALT_WORK_FACTOR = 10; // this value 10 will eventually need to be hidden
var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({ // bringing in mongoose
	email: {
		type: String,
		lowercase: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
});

userSchema.pre('save', function(next) { // what is this line doing?
	var user = this; // what is this line doing?
	if (!user.isModified('password')) { // if the user has not modified this password
		return next();
	}

  // when i call next()...this is what happens
  // user.save(function(err, user) {
// })
	// creating our salt
	return bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) {
			return next(err); 
		}

	// setting a hash to this saly
	return bcrypt.hash(user.password, salt, function(err, hash) {
		if (err) {
			return next(err);
		}

	// define what the password is for the user
		user.password = hash;
		return next();	
		});	
	});
});

// we don't want to call this first param "user"! We have another user defined!
// what is the key difference between statics and methods?
userSchema.statics.authenticate = function (formData, callback) {
	this.findOne({ // findOne is a method on the class, finding a person's email
		email: formData.email
	},
	function (err, user) {
		if (user === null) {
			callback("invalid username or password", null);
		}
		else {
			user.checkPassword(formData.password, callback); // check password is an instance Method
	}

	});
};
