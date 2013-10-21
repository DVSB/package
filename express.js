

	var app, screens, checkAuth,
	express = require('express'), app = module.exports = express(),
	enigma = require('./modules/_api')().enigma,
	fingerprint = require('./modules/_api')().fingerprint;
	
	
	checkAuth = function(req, res, next) {
		
		var isNotLogged, isLogged, cookies = req.signedCookies;
		
		isNotLogged = (!cookies.islogged || cookies.islogged!=='true');
		isLogged = (cookies.islogged==='true')&&(cookies.userhash===enigma.encrypt(cookies.userid));
	   
		if (isNotLogged) {
			app.all('/', function(req, res) {
				res.render('index.html');
			});
			next();
		}
					
		if (isLogged) {
			app.all('/', function(req, res) {
				require('./modules/dashboard')(req, res);
			});
			next();
		}
		
		// todo continue here
		// cookies still doesnt work well, i dont want why
		// needs more request, more refresh, more testing,
		// but think is finished
		
	}
	
	
	// config

	app.configure(function(){
		
		app.use('/s', express.static(__dirname+'/statics'));
		app.set('views', __dirname + '/views');
		app.engine('html', require('ejs').renderFile);
		
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		
      	app.use(express.cookieParser('9798789798798798JKJH987988')); 
		// app.use(express.cookieSession());
		
		app.use(checkAuth);
		
		app.use(express.favicon());
		app.use(app.router);		
	
	});
	
	// routing
	
	// if is article
	app.all('/-*', function(req, res) {
		
		// test if url is correct		
		// module = require('url').parse(req.url);
		// module = module.pathname.split('/')[1];
		// res.send(module.length);		
		
		require('./modules/preview')(req, res);
	
	});
	
	app.all('/new/', function(req, res) {
		res.render('new.html');
	});
	
	
	screens = [
		'preview', 'storage', 'usr', 'create'
	].forEach(function(mod){
		app.all('/'  + mod +  '/*', function(req, res) {
			require('./modules/' + mod)(req, res);
		});
	});


	// run

	if (!module.parent) {
		app.use(express.logger('dev'));
		app.listen(4090);
	}

	