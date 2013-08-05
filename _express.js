	

	// express 
	

	var express = require('express');
	var app = module.exports = express();


	// nexts

	
	function checkIfAuthentificated(req, res, next) {
		var settings = JSON.parse(require('fs').readFileSync('_settings.json')).settings;
		var hash = settings.hash.substr(0, 10);
		console.log(req);
		req.session.presence===hash ? next() : res.redirect(301, 'http://localhost:4000/signin/');
		next();
	}


	function checkInternetConnections(req, res, next) {
		require('dns').resolve4('www.google.com', function (err) {
			err ? res.send('Internet Connection Lost') : next();
		});
	}
	
	
	// config


	app.configure(function(){
						
		app.use(express.compress());
		app.use(express.methodOverride());
		
		//app.use(checkInternetConnections);
		
		app.use(express.bodyParser({ 
			uploadDir: __dirname+'/temp/' 
		}));
	
		var hash = JSON.parse(require('fs').readFileSync('_settings.json')).settings.hash;
		app.use(express.cookieParser(hash));
		app.use(express.cookieSession(hash));
		
		//app.use(checkIfAuthentificated);
	
		app.use(app.router);
		app.use('/statics', express.static(__dirname + '/views/statics'));

		app.set('views', __dirname + '/views');
		app.engine('html', require('ejs').renderFile);
		
	});
	
	
	// routing
	
	
	var screens = [
	'storage', 
	'signin',
	'upload',
	'account',
	'admin',
	'error'
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


	// good bye :)
	
	

