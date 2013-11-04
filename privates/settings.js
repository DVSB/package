module.exports = function(req, res) {

	action = require('url').parse(req.url).path.split('/')[3].split('?')[1];
	action = (action==='') ? null : action;

	console.log(action);

	switch(action) {

		case 'changepassword':
		require('./settings/changepassword')(req, res);
		break;
		
		default:
		require('./settings/settings')(req, res);
		break;
	
	};
	
};

