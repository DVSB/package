module.exports = function(req, res) {

	module = require('url').parse(req.url).path.split('/')[3].split('?')[0];
	module = (module==='') ? null : module;

	switch(module) {
		
		// if referer of this url should be form, this 
		// modules are run after click on Button in login
		// or register or reset password forms

		case 'form-createnew':
		require('./create/form-createnew')(req, res);
		break;
		
		// this part should work when is normally browsed
		// url and render only html, normally only for login
		// reset and register
		
		default:
		require('./create/new')(req, res);
		break;
	
	};
	
};
