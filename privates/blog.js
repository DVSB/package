module.exports = function(req, res) {

	module = require('url').parse(req.url).path.split('/')[3].split('?')[1];
	module = (module==='') ? null : module;

	switch(module) {

		case 'remove':
		require('./blog/remove')(req, res);
		break;

		case 'edit': 
		require('./blog/edit')(req, res);
		break;

		case 'preview': 
		require('./blog/preview')(req, res);
		break;
		
		default:
		require('./blog/display')(req, res);
		break;
	
	};
	
};

