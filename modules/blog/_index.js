module.exports = function(req, res) {

	module = require('url').parse(req.url).path.split('/')[3].split('?')[1];
	module = (module==='') ? null : module;

	switch(module) {

		case 'remove':
		require('./remove')(req, res);
		break;

		case 'edit': 
		require('./edit')(req, res);
		break;

		case 'savenew': 
		require('./savenew')(req, res);
		break;

		case 'preview': 
		require('./preview')(req, res);
		break;

		case 'update': 
		require('./update')(req, res);
		break;

		case 'create': 
		require('./create')(req, res);
		break;
		
		default:
		require('./display')(req, res);
		break;
	
	};
	
};

