

	// routing


	exports.init = function(req, res) {

		var fs = require('fs');
		res.locals.core = require('../core/_init').core();

		var underscore = require('underscore');
		underscore.mixin(require('underscore.string').exports());

		switch(req.body.action) {
		
			case 'signin' :
				var core = res.locals.core;
				core.database.searchUser(req.body.email, function(user) {
					loginCookies(req, res, user);
				});
				break;
				
			case 'signup' :
				console.log('registered');
				break;
			
			default :
				var renderedView = __dirname + '/../views/auth.html';
				res.render(renderedView);
			
		} 
	
	};
	
	
	// functions


	function loginCookies(req, res, user) {

		if (user) {
	
			var core = res.locals.core;
			console.log('ss');
			core.sessions.login(req, res, user.email);
			res.render('/../views/auth.html');
	
		} else {
		
			res.send('wrong user');
		
		}

	};
	
	