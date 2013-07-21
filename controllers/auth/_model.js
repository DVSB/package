
/* exports */


	exports.render = function(req, res){
		
		var renderedView = __dirname + '/../../views/_auth.html';
		res.render(renderedView);
	
	};


	exports.signin = function(req, res) {
		
		var core = {};
		core.hashing = require('../../core/hashing');
		core.database = require('../../core/database');
		
		var userEmail = req.body.email;
		core.database.searchUser(userEmail, function(user) {
			loginCookies(req, user);
		});

	};
	
	
	exports.signup = function(req, res){
		console.log('registered');
	};


/* functions */


	function loginCookies(req, user) {
		
		if (user) {
			
			var core = {};
			core.sessions = require('../../core/sessions');			
			core.sessions.login(req, user.email);
			
			res.render('/views/_auth.html');
			
		} else {
			
			console.log('user doesnt exists');
			var renderedView = __dirname + '/../../views/_auth.html';
			res.render(renderedView);
			
		}
		
	}
	
