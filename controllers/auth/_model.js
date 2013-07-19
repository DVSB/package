
	exports.render = function(req, res){
	
		var renderedView = __dirname + '/../../views/_auth.html';
		res.render(renderedView);
	
	};
	
	
	exports.signup = function(req, res){
	
		console.log('registered');
	
	};


	exports.signin = function(req, res) {
					
		var crypto = require('crypto');
		
		// amazon
		var AWS = require('aws-sdk');
		AWS.config.update({
			accessKeyId : settings.amazon.id,
			secretAccessKey : settings.amazon.key,
			region : settings.amazon.region
		});
		s3 = new AWS.S3();

		// get json
		s3.client.getObject({
			Bucket : settings.amazon.bucket,
			Key : 'users.json'
		}, function(err, data) {
						
			if (err) { console.log(err); }
			
			var cEmail = crypto.createHash('sha512').update(req.body.email).digest('hex').substr(0, 30);
			var cPassword = crypto.createHash('sha512').update(req.body.email + req.body.password).digest('hex').substr(0, 30);
		
			var doExistsUser = JSON.parse(data.Body)[cEmail];
			if (doExistsUser) {
						
				console.log('exists');
				
				var isPasswordCorrect = JSON.parse(data.Body)[cEmail]['password'];
	
				if (isPasswordCorrect==cPassword) {
					console.log('password match');
				} else {
					var renderedView = __dirname + '/../../views/_auth.html';
					res.render(renderedView);
				}
				
				var renderedView = __dirname + '/../../views/_auth.html';
				res.render(renderedView);
				
			} else {

				console.log('do not exists');
				
				var renderedView = __dirname + '/../../views/_auth.html';
				res.render(renderedView);
				
			}
			
		});

	};
	
	

