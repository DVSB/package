

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
	function RandomHash(str) {

		var underscore = require('underscore');
		underscore.mixin(require('underscore.string').exports());
		var fs = require('fs');

		fs.readFile('./configuration.json', function(err, data) {
			
			if (err) { throw err; }

			// Join more strings: (1) Salt from Configuration file, (2) Random number and (3) Date
			var hash = underscore.join(JSON.parse(data).Security.Salt, underscore.random(10000, 90000), Date.now()); 

			// Make SHA512 and trip to 80 chars
			return require('crypto').createHash('sha512').update(hash).digest('hex').substr(0, 14);


		});

	};

	RandomHash();