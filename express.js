

	var app, screens, checkAuth, settings,
	express = require('express'), app = module.exports = express();
	
	
	checkAuth = function(req, res, next) {
		
		var isNotLogged, isLogged, cookies = req.signedCookies,
		enigma = require('./modules/_api')().enigma;
		
		isNotLogged = (!cookies.islogged || cookies.islogged!=='true');
		isLogged = (cookies.islogged==='true')&&(cookies.userhash===enigma.encrypt(cookies.userid));
	   
		if (isNotLogged) {
			app.all('/-/*', function(req, res) {
				res.redirect('/');
			});
			next();
		}
					
		if (isLogged) {
			
			app.all('/-/*', function(req, res) {
				require('./modules/dashboard')(req, res);
			});
			
			screens = [
				'new', 'list', 'settings', 'view'
			].forEach(function(mod){
				app.all('/-/'  + mod +  '/*', function(req, res) {
					require('./modules/' + mod)(req, res);
				});
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
		
		app.use(express.favicon());
		//app.use(express.logger('dev'));
		
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		
		
      app.use(express.cookieParser('9798789798798798JKJH987988')); 
		// app.use(express.cookieSession());
		
		app.use(checkAuth);
		app.use(app.router);	
	
	});
	
	// routing
	
	app.all('/', function(req, res) {
		res.render('index.html');
	});
	
	
	screens = [
		'storage', 'usr', 'log' // , 'blog', 'support', 'status', 'prices'
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

	