var express = require("express"),
app = express(),
methodOverride = require('method-override'),
bodyParser = require("body-parser"),
morgan = require("morgan")
db = require("./models");


// why is bcrypt not included in app.js?
// we only need bcrypt to run for the user model
// bcrypt is great for one-way encryption

// role of Middleware is to refactor code
// can use as a function or an object

// single responsibility principle (Computer Science): 
// basically one file should only do one thing

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));

// app.use(loginMiddleware);

app.get('/', function(req,res){
  res.redirect('/countries');
});

// INDEX
app.get('/countries', function(req,res){
  db.Country.find({},function(err,countries){
    if (err) throw err;
    res.render("countries/index", {countries:countries});
  });
});

// NEW
app.get('/countries/new', function(req,res){
  res.render("countries/new");
});

// CREATE
app.post('/countries', function(req,res){
    var country = new db.Country(req.body.country);
    var cities = req.body.cities.split(", ");
    country.cities = cities;
    country.save(function(err){
      if (err) throw err;
      res.redirect('/');
    });
});

// SHOW

app.get('/countries/:id', function(req,res){
// app.get('/countries/:id', routeMiddleware.ensureLoggedIn, function(req, res))
  db.Country.findById(req.params.id,function(err,country){
    if (err) throw err;
    res.render("countries/show", {country:country});
  });
});

// EDIT

app.get('/countries/:id/edit', function(req,res){
  db.Country.findById(req.params.id,function(err,country){
    if (err) throw err;
    res.render("countries/edit", {country:country});
  });
});

// UPDATE
app.put('/countries/:id', function(req,res){
  db.Country.findById(req.params.id,function(err,country){
    // loop over all keys in object
    for(var prop in req.body.country){
      country.prop = req.body.country[prop];
    }
    country.cities = req.body.cities.split(", ");
    country.save(function(err,country){
      if (err) throw err;
      res.redirect('/');
    });
  });
});

// DESTROY
app.delete('/countries/:id', function(req,res){
    db.Country.findByIdAndRemove(req.params.id, function(err,book){
      if (err) throw err;
      res.redirect('/');
    });
});

// CATCH ALL
app.get('*', function(req,res){
  res.render('404');
});

app.listen(3000, function(){
  "Server is listening on port 3000";
});
