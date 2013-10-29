module.exports = function(req, res) {
	
	
	// this file care about login, registration, forgot and verify
	// user type password and if exists, is logged, if not is checked
	// if is verified and if it's correct password, if now, is redirected
	// to verify message or forgotten passsword message
	
	
	var checkIfExists, saveNewUserAndSendEmail, checkUserStatus, createCookies, formLogin, formReset,
	sendEmailVerification, verifyEmail, module, _api = require('./_api')(), s3 = _api.s3,
	fingerprint = _api.fingerprint, cookieSecret = _api.cookieSecret, random = _api.random,
	fprint = _api.fprint;
	
	var api = {};
	api.email = require('../api/email')();


	loginUser = function() { 
		
		var checkIfPasswordsEqual, checkIfUserVefified, 
		fingerprintEmail, fingerprintPassw;
			
		fingerprintEmail = fingerprint(req.body.loginEmail);
		fingerprintPassw = fingerprint(req.body.loginPassword);
		
		checkIfPasswordsEqual = function(passwrd, callback){
			if (passwrd!==fingerprintPassw) {
				/* wrong passwords error */
				res.redirect('/errors/e201');
			} else {	callback(); }
		}
		
		checkIfUserVefified = function(isVerified){
			if (isVerified!==true) {
				/* is not verified */ 
				res.redirect('/errors/e202');
			} else { createCookies(); }
		}
		
		s3.getObject({
			Key : fingerprintEmail+'/user-details/_config.json'
		}, function(data){
			var isOK1, isOK2;
			data = JSON.parse(data.Body+'');
			checkIfPasswordsEqual(data.password, function(){
				checkIfUserVefified(data.isVerified);
			});
		});

	}; 
		
	
	createCookies = function(){
				
		var publicUserHash;
		publicUserHash = fingerprint(req.body.loginEmail);
		
		res.cookie(
			'islogged', 
			'true', 
			{ signed: true, httpOnly: true }
		);
		
		res.cookie(
			'userid', 
			publicUserHash, 
			{ signed: true, httpOnly: true }
		);
		
		res.cookie(
			'userhash', 
			cookieSecret(publicUserHash), 
			{ signed: true, httpOnly: true }
		);
		
		res.redirect('/-/');
		
	};
	
	
	resetPassw = function(){
		
 		res.render('usr.html', { 
 			show : 'reset'
 		});
		
		return;
		
		api.email.verifyAccount(req.body.registerEmail);
		
	};


	isUserExists = function(email, callback) {
		
		s3.isObjectExists({
			Key : fingerprint(email)+'/user-details/_config.json'
		}, callback);
		
	};
	
	
	createNewUser = function(){
		
		var getTemplate, saveTemplate, editTemplate;
		
		getTemplate = function(){
					
			var templateConf = __dirname+'/../templates/configuration.json';	
			require('fs').readFile(templateConf, function (err, data) {
				if (err) throw err;
				editTemplate(data+'');
			});
			
		};
		
		editTemplate = function(data){
			
			data = JSON.parse(data);
			data.details.password = fingerprint(req.body.registerPassword1);
			data.api.publicKey = fingerprint(req.body.registerEmail);
			data.api.privateKey = random.generate();
			saveTemplate(JSON.stringify(data));
			
		};
	
		saveTemplate = function(data){
						
			var path;
			
			path = fingerprint(req.body.registerEmail);
			path += '/user-details/_config.json';
			
			s3.putObject({
				Key : path,
				Body : data
			}, function(){
				sendEmailVerif();
			});
			
		};
		
		sendEmailVerif = function(userEmail){
		
			var userEmail = req.body.registerEmail;
			api.email.verifyAccount(userEmail, fingerprint(userEmail), function(){
				res.redirect('/errors/i200');
			});
	
		};
				
		getTemplate();
	
	
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
	
		
	// this is browse module, this module use two parts of url, first
	// is module and second is search /usr/verify?mkldmkasmk, in switch
	// is browsed module and search can be send inside
	module = require('url').parse(req.url).path.split('/')[2].split('?')[0];
	module = (module==='') ? null : module;

	switch(module) {
		
		// form
	
		case 'formRegister':
		isUserExists(req.body.registerEmail, function(yes) {
			if (!yes) { 
				createNewUser();
			} else { res.redirect('/errors/e204'); }
		});
		break;
	
		case 'formLogin': 
		isUserExists(req.body.loginEmail, function(yes){
			if (yes) { loginUser();
			} else { res.redirect('/errors/e203'); }
		});
		break;

		case 'formReset': 
		isUserExists(function(yes){
			if (yes) { resetPassw();
			} else { res.send('sorry, this user doesnt exists'); }
		});
		break;
		
		case 'verify': 
		verifyAccountFromEmail();
		break;
		
		// display
	
		case 'login':
	 	res.render('usr.html', { show : 'login' });
		break;
		
		case 'reset':
	 	res.render('usr.html', { show : 'reset' });
		break;

		case 'register':
		res.render('usr.html', { show : 'register' });
		break;
		
		// default

		default:
		res.redirect('./register');
		break;
	
	};
	
};

