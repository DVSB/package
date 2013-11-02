

		var app, screens, hasAuth, settings,
		express = require('express'), app = module.exports = express();
	
	
	// Helper
	
		hasAuth = function(req, res, next){
		
			var existsLoggedCookie, isCookieLoggedTrue, cookieSecret, isCookieSecretEqual,
			cookies=req.signedCookies, _fingerprint = require('./api/fingerprint')().get;
			
			existsLoggedCookie = (cookies.islogged!==undefined);
			isCookieLoggedTrue = (cookies.islogged==='true');
			cookieSecret = (cookies.userid) ? _fingerprint(cookies.userid) : undefined;
			isCookieSecretEqual = (cookies.userhash===cookieSecret);
			
			isAuth = (existsLoggedCookie&&isCookieLoggedTrue&&isCookieSecretEqual);
			
			if (isAuth) { next();
			} else { res.redirect('/'); }
		
		}
	
	
	// config

		app.configure(function(){
				
			app.use('/s', express.static(__dirname+'/views/statics'));
			app.set('views', __dirname + '/views');
			app.engine('html', require('ejs').renderFile);
		
			app.use(express.favicon());
			//app.use(express.logger('dev'));
		
			app.use(express.bodyParser());
			
			app.use(express.methodOverride());
		
			app.use(express.cookieParser('74.27-as%87.47-as%82.47-vc%42.98-yx%14.89-xy')); 
			// app.use(express.cookieSession());
		
			app.use(app.router);	
	
		});
	
	
	// unauthorised
	
	
		app.all('/', function(req, res) {
			res.render('publics/index.html');
		});
	
		screens = [ 'storage', 'usr', 'log', 'errors', // , 'blog', 'support', 'status', 'prices'
		].forEach(function(mod){
			app.all('/'  + mod +  '/*', function(req, res) {
				require('./publics/' + mod)(req, res);
			});
		});
	
	
	// authorised
	
	
		app.all('/-/', hasAuth, function(req, res) {
			require('./privates/dashboard')(req, res);
		});
	
		screens = [ 'create', 'list', 'settings', 'view'
		].forEach(function(mod){
			app.all('/-/'  + mod +  '/*', hasAuth, function(req, res) {
				require('./privates/' + mod)(req, res);
			});
		});
	

	// run


		if (!module.parent) {
			app.use(express.logger('dev'));
			app.listen(4090);
		}

	