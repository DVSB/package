

	exports.render = function(req, res){
		
		var renderedView = __dirname + '/../../views/_auth.html';
		res.render(renderedView);
	
	};


	exports.signin = function(req, res) {
		
		var core = {};
		core.hashing = require('../../core/hashing');
		core.database = require('../../core/database');
		core.cookies = require('../../core/cookies');
		
		var userEmail = req.body.email;		
		core.database.searchUser(userEmail, function(user) {
			user ? loginCookies(user) : console.log('Sorry, user doesn\'t exists');
		});
		
		function loginCookies(user) {
			var renderedView = __dirname + '/../../views/_auth.html';
			res.render(renderedView);
		}

	};
	
	
	exports.signup = function(req, res){
	
		console.log('registered');
	
	};

