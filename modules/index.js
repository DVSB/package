module.exports = function(req, res) {
	

// variables


	var crypto = require('crypto');
	var fs = require('fs');
	var AWS = require('aws-sdk');
	var settings = JSON.parse(require('fs').readFileSync('_settings.json')).settings;

	var underscore = require('underscore');
	underscore.mixin(require('underscore.string').exports());


// functions


	var signup = function(){
		
		var user = {
			name : req.body.name,
			surname : req.body.surname
		};
		
		user.email = crypto.createHash('sha512').update(req.body.email + settings.hash).digest('hex');
		user.email = user.email.substr(0, 30);
		
		user.password = crypto.createHash('sha512').update(req.body.password + settings.hash).digest('hex');
		user.password = user.password.substr(0, 30);
		
		res.send(user);

	}
	
	
	var validation = function(callback){
		
		var password = req.body.password;
		password.length<=6 ? res.send('Your password is short, please you longer than 6 characters.') : false;
		
		
		
		callback();
		
	}
	

// routing and variables


	switch(req.body.action) {
		
		case 'signup' :
			validation(function(){
				signup();
			});
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