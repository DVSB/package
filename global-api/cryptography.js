
	// Hash your string with SHA512 sold 
	exports.Hash = function (str) {

		var crypto = require('crypto');
		var underscore = require('underscore');
		var underscorestring = require('underscore.string');
		
		var salt1 = '_-:.****?,)!§%|@#$~^&*{}][;_***-:.?,)!§%|@#$~^&*{}][;_**-:.?,)!§%|@#$~^&*{}][;_-:.?,)!§'; 
		var salt2 = 'qoindqowidnwquidnqwuidnqiwdqwduinqwdiqndnaasdkfasjkfnaskfjdnskfnaskfjdnaskfnskfdnafsjkd';
		
		var salt3 = '';
		for (var i=0; i<10; i++) { 
			salt3 = underscorestring.join('', salt3, underscore.random(1000000, 9000000));
		}
		
		// connect strings to one long
		var hash = underscorestring.join('', salt1, salt2, salt3, str);
		
		if (str) {
			hash = crypto.createHash('sha512').update(str).digest('hex').substr(50, 50);
		} else {
			hash = crypto.createHash('sha512').update(hash).digest('hex').substr(50, 50);
		}
		 		 
		// trim to 50 chars
		return hash;
		
	};
