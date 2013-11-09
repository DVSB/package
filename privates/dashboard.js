module.exports = function(req, res) {

	module = require('url').parse(req.url).path.split('/')[2].split('?')[0];
	module = (module==='') ? null : module;

	switch(module) {
		
		default:
		require('./dashboard/default')(req, res);
		break;
	
	};
	
};

