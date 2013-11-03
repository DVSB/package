module.exports = function(req, res) {

	action = require('url').parse(req.url).path.split('/')[3].split('?')[1];
	action = (action==='') ? null : action;

	switch(action) {

		case 'new':
		require('./create/new')(req, res);
		break;
		
		default:
		require('./create/render')(req, res);
		break;
	
	};
	
};

