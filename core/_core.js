	
	exports.init = function(){
		
		var underscore = require('underscore');
		var core = {};
		
		underscore.extend(core, require('./hashing').init(req, res));
		underscore.extend(core, require('./sessions').init(req, res));
		underscore.extend(core, require('./database').init(req, res));
		underscore.extend(core, JSON.parse(require('fs').readFileSync('./_settings.json')));

		return core;
		
	} 

