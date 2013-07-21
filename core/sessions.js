
	exports.login = function(req, res, email) {
		
		var core = res.locals.core;		
		req.session.email = email;		
		req.session.presence = core.settings.hash1.substr(0, 10);
		
	};
	
	
	exports.logout = function(user) {
		//console.log(user);
	};
	
	
	exports.update = function(user) {
		//console.log(user);
	};
