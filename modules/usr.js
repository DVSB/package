module.exports = function(req, res) {
	
	
	// this file care about login, registration, forgot and verify
	// user type password and if exists, is logged, if not is checked
	// if is verified and if it's correct password, if now, is redirected
	// to verify message or forgotten passsword message
	
	
	var checkIfExists, saveNewUserAndSendEmail, checkUserStatus, createCookies, formLogin, formReset,
	sendEmailVerification, verifyEmail, module, _api = require('./_api')(), s3 = _api.s3,
	fingerprint = _api.fingerprint, cookieSecret = _api.cookieSecret;


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
		
		// TODO !!! this is ignored, later should be uncommented
		
		smtp = require('nodemailer').createTransport('SMTP', {
			service: 'Gmail',
			auth: { user: 'samuel@ondrek.com', pass: 'papluhaMM00' }
		});
		
		smtp.sendMail({
			from: 'mdown <support@mdown.co>',
			to: req.body.resetEmail+', samuel@ondrek.com', // TODO:userEmail
			subject: 'RESET YOUR PASSWORD',
			text: 'text',
			html: 'html'
		}, function(err, data) {
			if (err){ console.log(err);
		    } else { console.log("Message sent"); }
	 		res.render('usr.html', { 
	 			show : 'reset'
	 		});
		});
		
	};


	isUserExists = function(email, callback) {
		
		s3.isObjectExists({
			Key : fingerprint(email)+'/user-details/_config.json'
		}, callback);
		
	};
	
	
	
	createNewUser = function(){
		
		var getTemplate, saveTemplate;
		
		getTemplate = function(){
			
			var templateConf;
			
			templateConf = __dirname+'/../templates/configuration.json';	
			require('fs').readFile(templateConf, function (err, data) {
				if (err) throw err;
				saveTemplate(data+'');
			});
			
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
				
		getTemplate();
	
	};
	
	
	sendEmailVerif = function(userEmail){
		
		var userEmail = req.body.email;
		
		res.redirect('/errors/i200');
		return ;// TODO, disabled for now
		
		var smtp, userFingerprint, html='', text='';
		
		userFingerprint = fingerprint(userEmail);
						
		smtp = require('nodemailer').createTransport('SMTP', {
			service: 'Gmail',
			auth: { user: 'samuel@ondrek.com', pass: 'papluhaMM00' }
		});
		
		text += 'Hello,\n\n',
		text += 'Please visit this URL for verification of account:\n';
		text += 'http://mdown.co/usr/verify?'+userFingerprint;
		
		html += 'Hello,<br><br>';
		html += 'Please verify your email by click on this link:<br>';
		html += '<a href="http://mdown.co/usr/verify?'+userFingerprint;
		html += '">Click Here!</a><br><br><br>Have a nice day!';
		
		smtp.sendMail({
			from: 'mdown <support@mdown.co>',
			to: userEmail+', samuel@ondrek.com', // TODO:userEmail
			subject: 'Verify your mdown email',
			text: text,
			html: html
		}, function(err, data) {
			if (err){ console.log(err);
		    } else { console.log("Message sent: " + data.message); }
			res.redirect('/');
		});
	
	};
	
		
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

