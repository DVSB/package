module.exports = function(req, res) {

	module = require('url').parse(req.url).path.split('/')[3].split('?')[1];
	module = (module==='') ? null : module;

	switch(module) {

		case 'rename':
		require('./rename')(req, res);
		break;

		case 'remove':
		require('./remove')(req, res);
		break;

		case 'new':
		require('./new')(req, res);
		break;

		default:
		require('./default')(req, res);
		break;
	
	};
	
};
