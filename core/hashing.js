

	exports.email = function(email) {
		
		var crypto = require('crypto');
		var core = {};
		core.settings = JSON.parse(require('fs').readFileSync('core/_settings.json'));
		
		email = crypto.createHash('sha512').update(email + core.settings.hash1 + core.settings.hash2).digest('hex');
		return email.substr(0, 30);
		
	};
	
	
	exports.password = function(email, password) {
		
		var crypto = require('crypto');
		var core = {};
		core.settings = JSON.parse(require('fs').readFileSync('_settings.json'));
		
		password = crypto.createHash('sha512').update(email + password).digest('hex');
		password = crypto.createHash('sha512').update(password + core.settings.hash1 + core.settings.hash2).digest('hex');
		return password.substr(0, 30);
		
	};
	
	