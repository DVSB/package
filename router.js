// IMPORTS

	// Base or Core framework
	var express = require('express');
	var app = module.exports = express();

	// todo: yes, its global for now.. desperate times desperate measures
	underscore = require('underscore');
	underscore.mixin(require('underscore.string').exports());

	fs = require('fs');


// CONFIGURATION

	function handleme(err, req, res, next) {
		
		console.log('aas');

		/*
		fs.readdir(__dirname + '/views', function(err, data){
			console.log('req: ' + req.headers.referer);
			console.log('data: ' + data);
			console.log('err: ' + err);
		    next();
		});*/
		
	};
		
	app.configure(function(){

		'use strict';

		// Request body parsing middleware supporting
		app.use(express.bodyParser({ 
			uploadDir: __dirname + '/temp/upload/' 
		}));
	
		// To allow PUT, GET, DELETE and POST
		app.use(express.methodOverride()); 
	
		// To allow cookies
		app.use(express.cookieParser()); 
	
		// Allow middleware and have to be before Sessions 
		// TODO: before cookies too?
		app.use(app.router);
	
		// All files from /PUBLIC folder can be browsed on /S url
		app.use('/s', express.static(__dirname + '/views/_publics'));
	
		console.log('+');
		app.use(handleme);
	
		// Set default word 'views' for views folder
		app.set('views', __dirname + '/views');
	
		// Allow EJS engine more on bit.ly/fUkZ1b
		app.engine('html', require('ejs').renderFile);

	});


// ROUTING

	// When browser sents any request (POST, GET..)
	// Browsed URL (localhost/pepek) is available in variable req.params.page
	app.all('/:page', function(req, res) {
		
		// Internal u200API gets array of existing views in /VIEWS folder
		var viewsArray = require('./app-api').ViewsList();
	
		var isExistView = underscore.find(viewsArray, function(item){ 
			return (item===req.params.page); 
		});
	
		// Include controller, else, If browser requests non-exist view in /VIEWS folder send 404 else 
		if (isExistView) {
			require('./views/amazon/_controller.js').Init(app, req, res);
		} else {
			res.send(404, 'you cannot do a get to unexist view!');
		}	
	
		//var isNotResource = underscore(req.url).startsWith('/-/');
		//console.log(isNotResource);
		//if(isNotResource && isExistView) {
			//require('./views/amazon/_controller.js').Init(app, req, res);
		//}			

	});

	// Allow with-dash-started file in view serve on /s/ path
	app.get('/s/-styles.css', function(req, res) {
			
		var currentView = underscore(req.headers.referer).strRightBack('/');
		res.sendfile('./views/amazon/-styles.css');
	
	});	


	// Allow with-dash-started file in view serve on /s/ path
	app.get('/s/-script.js', function(req, res) {
			
		if (req.headers.referer!==undefined) {
			var currentView = underscore(req.headers.referer).strRightBack('/');	
			res.sendfile('./views/amazon/-script.js');

		}
	
	});		

	// Redirect
	app.get('/', function(req, res) {
		res.redirect(301, 'http://localhost:4000/amazon');
	});


// PORT RUN !

	if (!module.parent) {	
		app.listen(4000);
		app.use(express.logger('dev')); // log to console all errors and requests
		console.log('Browse localhost:4000 for run your application in browser.');
	} 