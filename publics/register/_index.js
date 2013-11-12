module.exports = function(req, res) {

	module = require('url').parse(req.url).path.split('/')[2].split('?')[1];
	module = (module==='') ? null : module;

	switch(module) {

		case 'register':
		require('./register')(req, res);
		break;
		
		case 'verify':
		require('./verify')(req, res);
		break;
		
		default:
		require('./default')(req, res);
		break;
	
	};
	
};