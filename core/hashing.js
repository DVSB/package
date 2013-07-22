
	exports.init = function(){
	
		var crypto = require('crypto');
		var settings = JSON.parse(require('fs').readFileSync('_settings.json')).settings;
		
		return {
			
			hashingEmail : function(email) {
				email = crypto.createHash('sha512').update(email + settings.hash1 + settings.hash2).digest('hex');
				email = email;				
				return email.substr(0, 30);
			},
	
			hashingPassword : function(email, password) {
				password = crypto.createHash('sha512').update(email + password).digest('hex');
				password = crypto.createHash('sha512').update(password + settings.hash1 + settings.hash2).digest('hex');
				return password.substr(0, 30);
			}
			
		};
	
	}
