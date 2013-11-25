module.exports = function(req, res) {

	var action = require('url').parse(req.url).path.split('/')[2].split('?')[1];
	action = (action==='') ? null : action;

	switch(action) {

		case 'changepassword':
		//require('./changepassword')(req, res);
		break;
		
		case 'getpublickey':
		//require('./getpublickey')(req, res);
		break;
		
		default:
		require('./settings')(req, res);
		break;
	
	}
	
};
