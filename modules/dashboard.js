module.exports = function(req, res) {

	module = require('url').parse(req.url).path.split('/')[2].split('?')[0];
	module = (module==='') ? null : module;

	switch(module) {
		
		// if referer of this url should be form, this 
		// modules are run after click on Button in login
		// or register or reset password forms

		case 'form-register':
		require('./usr/form-register')(req, res);
		break;

		case 'form-login': 
		require('./usr/form-login')(req, res);
		break;

		case 'form-reset':
		require('./usr/form-reset')(req, res);
		break;
		
		// this part should work when is normally browsed
		// url and render only html, normally only for login
		// reset and register
		
	default:
	require('./dashboard/list')(req, res);
	break;
	
	};
	
};

