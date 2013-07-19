
	exports.render = function(req, res){
		
		var core = {};
		core.hashing = require('../../core/hashing');
		core.database = require('../../core/database');

		core.database.searchUser('samuel@ondrek.com', function(user){
			
			console.log(user);
			
			var renderedView = __dirname + '/../../views/_auth.html';
			res.render(renderedView);
			
			// TODO!
			// Now we have Crypted User from users.json from S3
			// We have also his Crypted email and Crypted password
			/* We dont have 
			
			var doExistsUser = JSON.parse(data.Body)[cryptedEmail];				
			var isPasswordCorrect = JSON.parse(data.Body)[cryptedEmail]['password'];
						
			if (doExistsUser && isPasswordCorrect==cPassword) {
				
				var err;
				var data = 'password correct';
				callback(err, data);
				
			} else if (doExistsUser && isPasswordCorrect!==cPassword) {
				
				var err = 'wrong password';
				var data;
				callback(err, data);
				
			} else {
				
				var err = 'user do not exists';
				var data;
				callback(err, data);
				
			}
			
			*/
			
			
			
		});

	
	};
	
	
	exports.signup = function(req, res){
	
		console.log('registered');
	
	};


	exports.signin = function(req, res) {
					
		console.log('signed');

	};
	
	

