module.exports = function(req, res) {	


// variables


	var crypto = require('crypto');
	var fs = require('fs');
	var AWS = require('aws-sdk');
	var settings = JSON.parse(require('fs').readFileSync('_settings.json')).settings;	


// functions


	var loginCookies = function(user) {

		if (user) {
			req.session.email = user.email;
			req.session.presence = settings.hash.substr(0, 10);
			res.render(__dirname+'/../views/signin.html');
		} else {
			logout();
			res.render(__dirname+'/../views/signin.html');
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

			if (err) { res.send(err); }
		
			var cryptedEmail = hashingEmail(req.body.email);
			var allUsers = JSON.parse(data.Body);
			var user = underscore.findWhere(allUsers, {'email':cryptedEmail});

			callback(user);

		});

	}; // databaseSearchUser


	var hashingEmail = function(email){
		
		email = crypto.createHash('sha512').update(email + settings.hash).digest('hex');
		return email.substr(0, 30);

	}; // hashingEmail


	var logout = function(){

		req.session = null;
		return;

	}; // logout


// routing and variables


	switch(req.body.action) {

		case 'signin' :
			databaseSearchUser(function(user) {
				loginCookies(user);
			});
			break;

		case 'signup' :
			console.log('registered');
			break;
	
		case 'logout' :
			logout();
			res.render(__dirname+'/../views/signin.html');
			break;

		default :
			res.render(__dirname+'/../views/signin.html');

	} // switch

};
