
	var express, app, screens;
		

	// express 

	express = require('express');
	app = module.exports = express();

	// config

	app.configure(function(){
					
		app.use(express.compress());
		app.use(express.methodOverride());
	
		app.use(express.bodyParser({ 
			uploadDir: __dirname+'/temp/' 
		}));

		app.set('views', __dirname + '/views');
		app.engine('html', require('ejs').renderFile);
	
	});


	// routing

	screens = [
		'w', 'list', 'auth', 'md'
	].forEach(function(mod){
		app.all('/'  + mod +  ';*', function(req, res) {
			var module = require('./modules/' + mod)(req, res);
		});
	});

	app.all('/', function(req, res) {
		var module = require('./modules/index')(req, res);
	});	


	// run

	if (!module.parent) {
		app.use(express.logger('dev'));
		app.listen(4090);
	}

	