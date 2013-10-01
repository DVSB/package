
	// express 

	var express = require('express');
	var app = module.exports = express();


	// config

	app.configure(function(){
					
		app.use(express.compress());
		app.use(express.methodOverride());
	
		app.use(express.bodyParser({ 
			uploadDir: __dirname+'/temp/' 
		}));	

		app.use(app.router);

		app.use('/statics', express.static(__dirname + '/views/statics'));
		app.set('views', __dirname + '/views');	
	
	});


	// routing

	var screens = [
		'home', 'storage', 'signin', 'upload', 'account', 'admin', 'error', 'photos', 'logout'
	].forEach(function(mod){
	
		app.all('/'  + mod +  '/*', function(req, res) {
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
