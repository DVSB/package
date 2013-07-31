module.exports = function(req, res) {
	

// variables


	var crypto = require('crypto');
	var fs = require('fs');
	var AWS = require('aws-sdk');
	var settings = JSON.parse(require('fs').readFileSync('_settings.json')).settings;
	var nodemailer = require('nodemailer').createTransport('SMTP', {
		service: "Gmail",
	    auth: { user: "samuel@ondrek.com", pass: "aaa" }
	});

	var underscore = require('underscore');
	underscore.mixin(require('underscore.string').exports());
			
	var s3 = new AWS.S3({ 
		accessKeyId : settings.awsId, 
		secretAccessKey : settings.awsKey, 
		region : settings.region,
		bucket : settings.bucket,
		storage : settings.storage
	});


// functions


	var sendEmail = function(){
		
		nodemailer.sendMail({
		    from: "n200 <support@n200.org>", 
		    to: req.body.email,
		    subject: "Activate n200 Account!",
		    text: "Hello, \n\nYour registration was successfull! Please click on this link to verify, that this is really yours email! Thank you! n200 Team.",
		    html: "Hello, <br><br>Your registration was successfull!<br>Please click on this link to verify, that this is really yours email! <br><br>Thank you!<br> n200 Team." 
		}, function(err, response){
			err ? res.send(err) : false;
			res.send("message sent: " + response.message);
		    nodemailer.close();
		});
	
	}

	
	var saveOnS3 = function(user){
		
		s3.client.getObject({
			Bucket : settings.bucket,
			Key : '_users.json'
		}, function(err, data) {

			if (err) { res.send(err); }
			var allUsers = JSON.parse(data.Body);
			
			var findUser = underscore.findWhere(allUsers, {'email':user.email});
			/*findUser ? res.send('ERR: User with this emails exists!') :*/ allUsers.push(user);
									
			s3.client.putObject({
				Bucket : settings.bucket,
				Key : '_users.json',
				Body : 	JSON.stringify(allUsers)
			}, function(err, data) {
				if (err) { res.send(err); }
				sendEmail();
			});

		});
		
	}


	var signup = function(){
		
		var user = {
			name : req.body.name,
			surname : req.body.surname,
			regtime : Date.now()
		};
		
		user.email = crypto.createHash('sha512').update(req.body.email + settings.hash).digest('hex');
		user.email = user.email.substr(0, 30);
		
		user.password = crypto.createHash('sha512').update(req.body.password + settings.hash).digest('hex');
		user.password = user.password.substr(0, 30);
		
		saveOnS3(user);
	
	}
	
	
	var validation = function(callback){
		
		var password = req.body.password;
		password.length<=6 ? res.send('ERR: Your password is short, please you longer than 6 characters.') : false;
		
		callback();
		
	}
	

// routing and variables


	switch(req.body.action) {
		
		case 'signup' :
			//validation(function(){
			signup();
			//});
			break;
			
		case 'as87a0d5ad' :
			console.log('* Upload Model runned');
			break;

		default :
			//DefaultUpload();
			res.render(__dirname+'/../views/_.html');
			break;

	} // switch


};