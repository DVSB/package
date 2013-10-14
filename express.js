
	var express, app, screens;
		

	// express 

	express = require('express');
	app = module.exports = express();


	// config

	app.configure(function(){
		
		var statics;
					
		app.use(express.compress());
		app.use(express.methodOverride());
	
		app.use(express.bodyParser());
		
		statics = express.static(__dirname+'/statics');
		app.use('/s', statics);

		app.set('views', __dirname + '/views');
		app.engine('html', require('ejs').renderFile);
	
	});


	// routing

	screens = [
		'preview', 'storage', 'edit', 'reg', 'das'
	].forEach(function(mod){
		app.all('/'  + mod +  '/*', function(req, res) {
			require('./modules/' + mod)(req, res);
		});
	});

	app.all('/', function(req, res) {
		res.render('index.html');
	});


	// run

	if (!module.parent) {
		app.use(express.logger('dev'));
		app.listen(4090);
	}

	