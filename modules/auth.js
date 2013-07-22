

exports.init = function(req, res) {	
	
	
// variables


	var crypto = require('crypto');
	var AWS = require('aws-sdk');
	var settings = JSON.parse(require('fs').readFileSync('_settings.json')).settings;	


// functions


	var loginCookies = function(user) {

		if (user) {
			req.session.email = user.email;
			req.session.presence = settings.hash1.substr(0, 10);
			//res.render(__dirname+'/../views/auth.html');
			res.send(req.session);
		} else {
			res.send('wrong user');
		} 

	}; // loginCookies


	var databaseSearchUser = function(callback){
		
		AWS.config.update({ 
			accessKeyId : settings.awsId, 
			secretAccessKey : settings.awsKey, 
			region : settings.region
		});
		var s3 = new AWS.S3();

		s3.client.getObject({
			Bucket : settings.bucket,
			Key : '_users.json'
		}, function(err, data) {

			if (err) { console.log(err); }
				
			var cryptedEmail = hashingEmail(req.body.email);
			var allUsers = JSON.parse(data.Body);
			var user = underscore.findWhere(allUsers, {'email':cryptedEmail});

			callback(user);

		});

	}; // databaseSearchUser
	
	
	var hashingEmail = function(email){
				
		email = crypto.createHash('sha512').update(email + settings.hash1 + settings.hash2).digest('hex');
		return email.substr(0, 30);

	}; // hashingEmail
	
	
	var logout = function(){
		
		req.session = null;
		
	}; // logout
	
	
// routing and variables


	switch(req.body.action) {

		case 'signin' :
			databaseSearchUser(function(user) {
				console.log(user);
				loginCookies(user);
			});
			break;
		
		case 'signup' :
			console.log('registered');
			break;
			
		case 'signout' :
			logout();
			break;
	
		default :
			res.render(__dirname+'/../views/auth.html');
	
	} // switch
	

}; // init

