

	var express = require('express');
	var app = module.exports = express();


// Configuration for Express


	app.configure(function(){

		app.use(express.favicon());
		
		app.use('/s', express.static(__dirname+'/views/fonts'));
		app.use('/s', express.static(__dirname+'/views/javascript'));
        app.use('/s', express.static(__dirname+'/views/css'));
		
		app.set('views', __dirname + '/views');
		app.engine('html', require('ejs').renderFile);

		app.use(express.json());
		app.use(express.urlencoded());

		app.use(express.methodOverride());
		app.use(app.router);

	});


// Routing


	app.all('/', function(req, res) {
		require('./dashboard/settings/_index')(req, res);
	});


    [ 'blog', 'errors', 'generate', 'install', 'login', 'logout', 'settings', 'routing',
      'tags', 'template' ].forEach(function(screen){
		app.all('/'  + screen +  '/*', function(req, res) {
			require('./dashboard/' + screen + '/_index')(req, res);
		});
	});


// Server only on Development Env


	if (!module.parent) {
		app.use(express.logger('dev'));
		app.listen(4091);
        console.log('browser localhost:4091 for preview');
	}

