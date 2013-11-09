module.exports = function(req, res) {

	var action = require('url').parse(req.url).path.split('/')[3].split('?')[1];
	action = (action==='') ? null : action;


	switch(action) {

		case 'update':
		require('./template/update')(req, res);
		break;
		
		default:
		require('./template/default')(req, res);
		break;
	
	};
	
};