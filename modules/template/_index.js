module.exports = function(req, res) {

	var action = require('url').parse(req.url).path.split('/')[3].split('?')[1];
	action = (action==='') ? null : action;


	switch(action) {

		case 'update':
		require('./update')(req, res);
		break;

		case 'editor':
		require('./editor')(req, res);
		break;
		
		default:
		res.redirect('/-/modules/');
		break;
	
	};
	
};