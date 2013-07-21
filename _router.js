
// imports

	var express = require('express');
	var app = module.exports = express();

// next functions

	function authentification(req, res, next) {
		//var hash = JSON.parse(require('fs').readFileSync('core/_settings.json')).hash1.substr(0, 10);
		//req.signedCookies.presence==hash ? console.log('correct') : console.log('uncorrect');
		next();
	}
	
	function checkInternetConnections(req, res, next) {
		require('dns').resolve4('www.google.com', function (err) {
			err ? res.send('Internet Connection Lost') : next();
		});
	}

// config

	app.configure(function(){

		'use strict';
		
		app.use(checkInternetConnections);

		// Request body parsing middleware supporting
		app.use(express.bodyParser({ 
			uploadDir: __dirname + '/temp_upload/' 
		}));
	
		// To allow PUT, GET, DELETE and POST
		app.use(express.methodOverride()); 
	
		// To allow cookies, crypted by _settings.json hash
		var secretKey = JSON.parse(require('fs').readFileSync('core/_settings.json')).hash1;
		app.use(express.cookieParser(secretKey)); 
		app.use(express.session(secretKey));
		
		// use in every call this function
		// todo: should be later authe, cookies, sessions, url controll
		app.use(authentification);
		
	
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

// ROUTING OF CONTROLLERS

	app.all('/storage/*', function(req, res) {
		require('./routers/_storage.js').init(req, res);
	});
	
	app.all('/register/*', function(req, res) {
		require('./routers/_register.js').init(req, res);
	});
	
	app.all('/auth/*', function(req, res) {
		require('./routers/_auth.js').init(req, res);
	});
	
	app.all('/settings/*', function(req, res) {
		require('./routers/_settings.js').init(req, res);
	});

// STATICS AND REDIRECTS
	
	app.get('/s/-styles.css', function(req, res) {
		res.sendfile('./views/-styles.css');
	});
	
	app.get('/s/-script.js', function(req, res) {
		res.sendfile('./views/-script.js');
	});		

	app.get('/', function(req, res) {
		res.redirect(301, 'http://localhost:4000/storage/');
	});
	
	app.get('/', function(req, res) {
		res.redirect(301, 'http://localhost:4000/storage/');
	});

// PORT RUN !

	if (!module.parent) {	
		app.listen(4000);
		app.use(express.logger('dev')); // log to console all errors and requests
	}
