module.exports = function(req, res) {

	module = require('url').parse(req.url).path.split('/')[2].split('?')[1];
	module = (module==='') ? null : module;

	switch(module) {

		case 'reset':
		require('./reset/reset')(req, res);
		break;
		
		default:
		require('./reset/reset')(req, res);
		break;
	
	};
	
};