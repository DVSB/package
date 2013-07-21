	
	exports.core = function() {
		
		var core = {};
		
		core.hashing = require('./hashing');
		core.sessions = require('./sessions');
		core.database = require('./database');

		core.settings = require('fs').readFileSync('./core/_settings.json');
		core.settings = JSON.parse(core.settings);

		return core;
		
	};
	
