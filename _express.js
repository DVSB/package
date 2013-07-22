	

	// express 
	

	var express = require('express');
	var app = module.exports = express();
	
	underscore = require('underscore');
	underscore.mixin(require('underscore.string').exports());

	// next


	/*
		function authentification(req, res, next) {
			var hash = JSON.parse(require('fs').readFileSync('core/_settings.json')).hash1.substr(0, 10);
			req.signedCookies.presence==hash ? console.log('correct') : console.log('uncorrect');
			next();
		}
	
	*/
	
	
	function checkInternetConnections(req, res, next) {
		require('dns').resolve4('www.google.com', function (err) {
			err ? res.send('Internet Connection Lost') : next();
		});
	}
	
	
	// config


	app.configure(function(){
						
		app.use(express.compress());
		app.use(express.methodOverride());
		
		app.use(checkInternetConnections);
		
		app.use(express.bodyParser({ 
			uploadDir: __dirname+'/temp/' 
		}));
	
		var hash = JSON.parse(require('fs').readFileSync('_settings.json')).settings.hash1;
		app.use(express.cookieParser(hash));
		app.use(express.cookieSession(hash));
	
		app.use(app.router);
		app.use('/statics', express.static(__dirname + '/views/statics'));

		app.set('views', __dirname + '/views');
		app.engine('html', require('ejs').renderFile);
		
	});
	
	
	// routing
	
		
	underscore.each([
		'storage', 
		'register', 
		'auth', 
		'settings'
	], function(mod){
		
		app.all('/'  + mod +  '/*', function(req, res) {
			var module = require('./modules/' + mod + '.js');
			module.init(req, res);
		});
		
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
	
	
