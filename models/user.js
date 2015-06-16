// MAKE SURE TO GIT PUSH ORIGIN country-auth !!!


var bcrypt = require("bcrypt"); // this is for adding and salting passwords
// we use bcrypt to encrypt the password
// why is SALT_WORK_FACTOR all capitalized?
var SALT_WORK_FACTOR = 10; // this value 10 will eventually need to be hidden
// will generate snippets of code how many number of times

var mongoose = require("mongoose"); // mongoose is a library on top of a database
// ODM : Object Data Mapper, connecting to a Mongo Database

var userSchema = new mongoose.Schema({ // bringing in mongoose
	email: { // email object
		type: String,
		lowercase: true, // it will lowercases what the user types in, using "true" makes these validations
		required: true // validation
	},
	password: { // password object
		type: String,
		required: true // validation, forcing the data to behave in a certain way
	}
});

//  before we save, pre. - its sole job to see if password has been modified 
userSchema.pre('save', function(next) { // save method, callback function
// .pre takes in some name, and some callback

	var user = this; // what is this line doing?
	if (!user.isModified('password')) { // if the user has not modified this password
		return next(); // next exits out of the function
	} // this line pretty much is an else (without the else)
// callback function is called in previous line

  // when i call next()...this is what happens
  // user.save(function(err, user) {
// })

	// creating our salt within a callback function
	// callbacks are asynchronous
	return bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) {
			return next(err); 
		}

	// setting a hash to this salt
	return bcrypt.hash(user.password, salt, function(err, hash) {
		if (err) { // if error
			return next(err); // generate the error
		}

	// define what the password is for the user
		user.password = hash;
	// everything looks good, let's save this!	
		return next();	
		});	
	});
});

// we don't want to call this first param "user"! We have another user defined!
// what is the key difference between statics and methods?
// statics == 
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

// methods === INSTANCE METHODS!
userSchema.methods.checkPassword = function(password, callback) {
	var user = this;
	bcrypt.compare(password, user.password, function(err, isMatch){ // two parameters in callback function
		if (isMatch) { // isMatch is a boolean
			callback(null, user); // one parameter will either have this value
		} else {
			callback("invalid username or password", null); // or this value
		}
	});
};
