// IMPORTS

	// Base or Core framework
	var express = require('express');
	var app = module.exports = express();

// AUTH

	function authentification(req, res, next){
		//console.log('here should be auth');
		next();
	}

// CONFIGURATION

	app.configure(function(){

		'use strict';

		// Request body parsing middleware supporting
		app.use(express.bodyParser({ 
			uploadDir: __dirname + '/temp_upload/' 
		}));
		
		// use in every call this function
		// todo: should be later authe, cookies, sessions, url controll
		app.use(authentification);
	
		// To allow PUT, GET, DELETE and POST
		app.use(express.methodOverride()); 
	
		// To allow cookies
		app.use(express.cookieParser()); 
	
		// Allow middleware and have to be before Sessions 
		// TODO: before cookies too?
		app.use(app.router);
	
		// All files from /PUBLIC folder can be browsed on /S url
		app.use('/s', express.static(__dirname + '/views/_publics'));
	
		// Set default word 'views' for views folder
		app.set('views', __dirname + '/views');
	
		// Allow EJS engine more on bit.ly/fUkZ1b
		app.engine('html', require('ejs').renderFile);

	});


// ROUTING

	app.all('/app*', function(req, res) {
		require('./controllers/_storage.js').init(req, res);
	});
	
	app.get('/s/-styles.css', function(req, res) {
		res.sendfile('./views/-styles.css');
	});
	
	app.get('/s/-script.js', function(req, res) {
		res.sendfile('./views/-script.js');
	});		

	app.get('/', function(req, res) {
		res.redirect(301, 'http://localhost:4000/amazon');
	});

// PORT RUN !

	if (!module.parent) {	
		app.listen(4000);
		app.use(express.logger('dev')); // log to console all errors and requests
		console.log('Browse \"localhost:4000/app\" for run your application in browser.');
	}