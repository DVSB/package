
	exports.ReadCookies = function(req, res) {
	
		// create global object
		ulib = {};
		
		var underscore = require('underscore');
		underscore.extend(ulib.cookies, req.cookies);
		
		return ulib;
		
	};
