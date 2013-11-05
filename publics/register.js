module.exports = function(req, res) {

	module = require('url').parse(req.url).path.split('/')[2].split('?')[1];
	module = (module==='') ? null : module;

	switch(module) {

		case 'register':
		require('./register/register')(req, res);
		break;
		
		case 'verify':
		require('./register/verify')(req, res);
		break;
		
		default:
		require('./register/default')(req, res);
		break;
	
	};
	
};