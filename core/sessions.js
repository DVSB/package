
	exports.login = function(req, email) {
		
		var settings = JSON.parse(require('fs').readFileSync('core/_settings.json'));
		req.session.email = email;		
		req.session.presence = settings.hash1.substr(0, 10);
		
		console.log('b');
		
	};
	
	
	exports.logout = function(user) {
		//console.log(user);
	};
	
	
	exports.update = function(user) {
		//console.log(user);
	};
