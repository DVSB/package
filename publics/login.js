module.exports = function(req, res) {

	module = require('url').parse(req.url).path.split('/')[2].split('?')[1];
	module = (module==='') ? null : module;

	switch(module) {

		case 'login':
		require('./login/login')(req, res);
		break;
		
		default:
		require('./login/default')(req, res);
		break;
	
	};
	
};