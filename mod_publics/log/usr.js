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
		
		// this links are opened when refered is email
		// this should be run only for verification of
		// email and reset of password
		
		case 'email-verify':
		require('./usr/email-verify')(req, res);
		break;
	
		case 'email-resetPass': 
		require('./usr/email-resetPass')(req, res);
		break;
		
		// this part should work when is normally browsed
		// url and render only html, normally only for login
		// reset and register

		case 'login':
		require('./usr/login')(req, res);
		break;
	
		case 'reset':
		require('./usr/reset')(req, res);
		break;

		case 'register':
		require('./usr/register')(req, res);
		break;
		
	default:
	require('./usr/default')(req, res);
	break;
	
	};
	
};

