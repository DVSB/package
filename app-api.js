
	exports.ReadCookies = function(req, res) {
	
		// create global object
		ulib = {};
		
		var underscore = require('underscore');
		underscore.extend(ulib.cookies, req.cookies);
		
		return ulib;
		
	};






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

	




	var underscore = require('underscore');
	underscore.mixin(require('underscore.string').exports());
		

	exports.ViewsList = function() {
	
		// Get all files from /views folder
		var files = require('fs').readdirSync(__dirname + '/../views');
		

				
		// Filter to only folders which starst with "view-"
		var filtered = underscore.filter(files, function(item) {
			return underscore(item).startsWith("view-"); 
		});
		
		for (var i=0; i<filtered.length; i++) {
			filtered[i] = underscore(filtered[i].toString()).splice(0, 5);
		}
		
		return filtered;
		
	};
	
	exports.AllBuckets = function() {
	
		// Get all files from /storage folder
		var files = require('fs').readdirSync(__dirname + '/../tmp-storage');
				
		// Filter to only folders which starst with "view-"
		var filtered = underscore.filter(files, function(item) {
			return underscore(item).startsWith("bucket-"); 
		});
		
		for (var i=0; i<filtered.length; i++) {
			filtered[i] = underscore(filtered[i].toString()).splice(0, 7);
		}
		
		return filtered;
		
	};

