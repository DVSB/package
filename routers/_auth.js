
	exports.init = function(req, res) {
				
		// in future here should be routing of sections
		// what happens when is submited form
		// what happens when request is comming
		// what happens before rendering 
		// this file is runned with parameters req and res immediately after load
		
		var fs = require('fs');
		settings = JSON.parse(fs.readFileSync('settings.json'));
		
		underscore = require('underscore');
		underscore.mixin(require('underscore.string').exports());
		
		var model = require('./../controllers/auth/_model');
		
				
		if (req.body.action === 'signin') {
			model.signin(req, res);
		} else if (req.body.action==='signup') {
			model.signup(req, res);
		} else {
			model.render(req, res);
		};
		
	};