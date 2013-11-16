

	var express = require('express');
	var app = module.exports = express();

	
// Helper

	var hasAuth = function(req, res, next){
	
		/*
		
		JUST FOR NOW 
		
		var existsLoggedCookie, isCookieLoggedTrue, cookieSecret, isCookieSecretEqual,
		cookies=req.signedCookies, _fingerprint = require('./api/fingerprint')().get;
		
		existsLoggedCookie = (cookies.islogged!==undefined);
		isCookieLoggedTrue = (cookies.islogged==='true');
		cookieSecret = (cookies.userid) ? _fingerprint(cookies.userid) : undefined;
		isCookieSecretEqual = (cookies.userhash===cookieSecret);
		
		isAuth = (existsLoggedCookie&&isCookieLoggedTrue&&isCookieSecretEqual);
		
		if (isAuth) { next();
		} else { res.redirect('/'); }
		*/
		
		next();
		
	}


// config

	app.configure(function(){

		app.use(express.logger('dev'));

		app.use(express.favicon());
		
		app.use('/s', express.static(__dirname+'/views/fonts'));
		app.use('/s', express.static(__dirname+'/views/stylesheets'));
		app.use('/s', express.static(__dirname+'/views/images'));
		app.use('/s', express.static(__dirname+'/views/javascript'));
		
		app.set('views', __dirname + '/views');
		app.engine('html', require('ejs').renderFile);
	
		app.use(express.json());
		app.use(express.urlencoded());

		app.use(express.methodOverride());

		var salt = '74.27-as%87.47-as%82.47-vc%42.98-yx%14.89-xy';
		app.use(express.cookieParser(salt)); 
	
		app.use(app.router);

	});


// unauthorised


	app.all('/', function(req, res) {
		res.render('publics/index.html');
	});

	var screens = [
		'log', 'errors', 'support', 'docs', 'media', 'logout',
		'privacy', 'faq', 'register', 'login', 'reset'
	].forEach(function(mod){
		app.all('/'  + mod +  '/*', function(req, res) {
			require('./publics/' + mod +'/_index')(req, res);
		});
	});


// authorised


	app.all('/-/', hasAuth, function(req, res) {
		require('./privates/dashboard/_index')(req, res);
	});

	var screens = [
		'settings', 'blog', 'modules', 'template', 'generate', 
		'tags'
	].forEach(function(mod){
		app.all('/-/'  + mod +  '/*', hasAuth, function(req, res) {
			require('./privates/' + mod + '/_index')(req, res);
		});
	});


// run


	if (!module.parent) {
		app.use(express.logger('dev'));
		app.listen(4090);
	}

