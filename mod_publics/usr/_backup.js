module.exports = function(req, res) {
	
	
	// this file care about login, registration, forgot and verify
	// user type password and if exists, is logged, if not is checked
	// if is verified and if it's correct password, if now, is redirected
	// to verify message or forgotten passsword message
	
	
	var checkIfExists, saveNewUserAndSendEmail, checkUserStatus, formLogin, formReset,
	sendEmailVerification, verifyEmail, module, _api = require('./_api')(), s3 = _api.s3,
	fingerprint = _api.fingerprint, cookieSecret = _api.cookieSecret, random = _api.random,
	fprint = _api.fprint;
	
	var api = {};
	api.email = require('../api/email')();


	
	
	verifyKeyForResetPassword = function(){
		
		var
		url = require('url').parse(req.url).path.split('/')[2].split('?')[1].split('-'),
		publicKey = url[0],
		privateKey = url[1],
		checkKey = fingerprint(publicKey).substring(0, 30);
		
		if (checkKey===privateKey){ sendNewPasswordToEmail(publicKey);
		} else { res.redirect('/errors/e206'); }

	};
	
	
	sendNewPasswordToEmail = function(publicKey){
		
		var
		uploadNewConfig,
		newPassword,
		sendNewPasswordToEmail,
		getConfig;
		
		newPassword = fingerprint(publicKey).substring(30, 10);
		
		getConfig = function(){
			
			s3.getObject({
				Key : publicKey+'/user-details/_config.json'
			}, function(data){
				data = JSON.parse(data.Body+'');
				data.details.password = fingerprint(newPassword),
				data = JSON.stringify(data);
				uploadNewConfig(data);
			});
			
		};
		
		uploadNewConfig = function(data){
			
			s3.putObject({
				Key : publicKey+'/user-details/_config.json',
				Body : data,
				ContentType : 'application/json'
			}, function(){
				displayNewPassword();
			});
			
		};
		
		displayNewPassword = function(){
			
			res.send('new password is: ' + newPassword);
			
		};
		
		getConfig();
		
	}


	isUserExists = function(email, callback) {
		
		s3.isObjectExists({
			Key : fingerprint(email)+'/user-details/_config.json'
		}, callback);
		
	};
	
	
	
	
	verifyAccountFromEmail = function(){
		
		var
		publicKey = require('url').parse(req.url).path.split('/')[2].split('?')[1],
		verifyThisAccount;
		
		s3.isObjectExists({
			Key : publicKey+'/user-details/_config.json'
		}, function(yes){
			if (yes) { getActualConfig(); 
			} else { res.send('this key doesnt exists with any account'); }
		});
		
		getActualConfig = function(){
			
			s3.getObject({
				Key : publicKey+'/user-details/_config.json'
			}, function(data){
				data = JSON.parse(data.Body+'');
				data.details.isVerified = true;
				data = JSON.stringify(data);
				uploadNewConfig(data);
			});
			
		}
		
		uploadNewConfig = function(data){
			
			s3.putObject({
				Key : publicKey+'/user-details/_config.json',
				Body : data,
				ContentType : 'application/json'
			}, function(data){
				res.redirect('/');
			});
			
		}
				
	}
	
	
	switch(module) {
		
		
		// email
		
		case 'emailVerify': 
		verifyAccountFromEmail();
		break;
		
		case 'emailResetPass': 
		verifyKeyForResetPassword();
		break;
		
		
	
	};
	
};

