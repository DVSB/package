module.exports = function(req, res) {

	var module = require('url').parse(req.url).path.split('/')[1].split('?')[1];
	module = (module==='') ? null : module;

	switch(module) {

		case 'update':
		require('./update')(req, res);
		break;

		case 'new':
		require('./new')(req, res);
		break;

		default:
		require('./default')(req, res);
		break;
	
	}
	
};