

	exports.init = function(req, res){
		
		var crypto = require('crypto');
		var AWS = require('aws-sdk');
		var settings = JSON.parse(require('fs').readFileSync('_settings.json')).settings;

		return {
		
			databaseSearchUser : function(email, callback) {

				AWS.config.update({ 
					accessKeyId : settings.awsId, 
					secretAccessKey : settings.awsKey, 
					region : settings.region
				});
				s3 = new AWS.S3();
		
				s3.client.getObject({
					Bucket : settings.bucket,
					Key : '_users.json'
				}, function(err, data) {
			
					if (err) { console.log(err); }
					
					var cryptedEmail = require('./hashing').hashingEmail(email);
					var allUsers = JSON.parse(data.Body);
					var user = underscore.findWhere(allUsers, {'email':cryptedEmail});
					
					callback(user);
			
				});
	
			}
		
		};

	};

