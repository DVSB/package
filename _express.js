

	'use strict';
	

	// express 
	

	var express = require('express');
	var app = module.exports = express();

	// next


	/*
		function authentification(req, res, next) {
			var hash = JSON.parse(require('fs').readFileSync('core/_settings.json')).hash1.substr(0, 10);
			req.signedCookies.presence==hash ? console.log('correct') : console.log('uncorrect');
			next();
		}
	
		function checkInternetConnections(req, res, next) {
			require('dns').resolve4('www.google.com', function (err) {
				err ? res.send('Internet Connection Lost') : next();
			});
		}
	*/


	// config


	app.configure(function(){
				
		app.use(express.compress());
		app.use(express.methodOverride());
		
		app.use(express.bodyParser({ 
			uploadDir: __dirname+'/temp/' 
		}));
	
		var hash = require('./core/_init').core().settings.hash1;
		app.use(express.cookieParser(hash));
		app.use(express.cookieSession(hash));	
	
		app.use(app.router);
		app.use('/statics', express.static(__dirname + '/views/statics'));

		app.set('views', __dirname + '/views');
		app.engine('html', require('ejs').renderFile);
		
	});
	
	
	// routing


	app.all('/storage/*', function(req, res) {
		require('./modules/storage.js').init(req, res);
	});
	
	app.all('/register/*', function(req, res) {
		require('./modules/register.js').init(req, res);
	});
	
	app.all('/auth/*', function(req, res) {
		require('./modules/auth.js').init(req, res);
	});
	
	app.all('/settings/*', function(req, res) {
		require('./modules/settings.js').init(req, res);
	});


	// statics and redirects	


	app.get('/', function(req, res) {
		res.redirect(301, 'http://localhost:4000/storage/');
	});


	// run
	

	if (!module.parent) {
		app.use(express.logger('dev'));
		app.listen(4000);
	}


	// good bye :)
	
	