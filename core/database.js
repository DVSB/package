

	exports.searchUser = function (email, callback) {
		
		var crypto = require('crypto');
		
		var core = {};
		core.hashing = require('./hashing');
		core.settings = JSON.parse(require('fs').readFileSync('core/_settings.json'));
		
		var AWS = require('aws-sdk');
		AWS.config.update({ 
			accessKeyId : core.settings.awsId, 
			secretAccessKey : core.settings.awsKey, 
			region : core.settings.region
		});
		s3 = new AWS.S3();
		
		s3.client.getObject({
			Bucket : core.settings.bucket,
			Key : 'users.json'
		}, function(err, data) {
			
			if (err) { console.log(err); }
			
			var cryptedEmail = core.hashing.email(email);
			var existsUser = JSON.parse(data.Body)[cryptedEmail];				
			callback(existsUser);
	
		});
	
	};
