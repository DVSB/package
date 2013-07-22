

	// routing


	exports.init = function(req, res) {
		
		var core = res.locals.core;
		
		var underscore = require('underscore');
		underscore.mixin(require('underscore.string').exports());

		switch(req.body.action) {
		
			case 'signin' :
				core.databaseSearchUser(req.body.email, function(user) {
					loginCookies(req, res, user);
				});
				break;
				
			case 'signup' :
				console.log('registered');
				break;
			
			default :
				res.render(__dirname+'/../views/auth.html');
			
		} 
	
	};
	
	
	// functions


	function loginCookies(req, res, user) {

		if (user) {
	
			var core = res.locals.core;
			core.sessionLogin(req, res, user.email);
			res.render(__dirname+'/../views/auth.html');
	
		} else {
			res.send('wrong user');
		
		}

	}
	
	
