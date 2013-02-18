

	// Return all folders in views folder
	// Used in routing for check if really exist before run
	exports.ViewsList = function() {

		// Get all files from /views folder
		var files = require('fs').readdirSync(__dirname + '/views');

		// Array
		return files;

	};
	

	// Get a random number
	// Return random string from Uniq date, Security string and Random number
	exports.RandomHash = function() {

		var fs = require('fs');
		var underscore = require('underscore');

		underscore.mixin(require('underscore.string').exports());

		// Join two strings into one where (1) is Date and (2) is Number
		var random = underscore.join( 
			Date.now(),
			underscore.random(10000, 90000)
		);

		// (1) Use hash SHA512, (2) Use hex format, (3) Trim to 14 characters
		return require('crypto').createHash('sha512').update(random).digest('hex').substr(0, 14); 

	};