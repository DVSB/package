module.exports = function(req, res) {
	
	
	// this file care about login, registration, forgot and verify
	// user type password and if exists, is logged, if not is checked
	// if is verified and if it's correct password, if now, is redirected
	// to verify message or forgotten passsword message
	
	
	var checkIfExists, saveNewUserAndSendEmail, checkUserStatus, createCookies, formLogin, formReset,
	sendEmailVerification, verifyEmail, module, _api = require('./_api')(), s3 = _api.s3,
	fingerprint = _api.fingerprint, enigma = _api.enigma;


	loginUser = function() {
		
		var arePassEqual, isVerified, checkIfPasswordsEqual, userCheck;
		
		arePassEqual = function(user){
			return (user.password===fingerprint(req.body.password));
		}
		
		isVerified = function(user){
			return true;
			// TODO, uncomment, when email verification available
			// return (user.isVerified===true);
		}
		
		checkIfPasswordsEqual = function(data){
			data = JSON.parse(data.Body+'');
			if (arePassEqual(data)&&isVerified(data)) { createCookies();
			} else { res.send('not equal pass or user not verified'); }
		}
		
		s3.getObject({
			key : fingerprint(req.body.email)+'/user-details/_config.json'
		}, checkIfPasswordsEqual);
		
	};
	
	
	createCookies = function(){
		
		var publicUserHash, enigmaUserHash;
		
		publicUserHash = fingerprint(req.body.email);
		enigmaUserHash = enigma.encrypt(publicUserHash);
		
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
			enigmaUserHash, 
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


	isUserExists = function(callback) {
		
		s3.isObjectExists({
			key : fingerprint(req.body.email)+'/user-details/_config.json'
		}, callback);
		
	};
	
	
	createNewUserl = function(){
		
		s3.putObject({
			key : fingerprint(req.body.email)+'/user-details/_config.json',
			body : JSON.stringify({ 
				password : fingerprint(req.body.password),
				isVerified : false
			})
		}, function(data){
			sendEmailVerification(req.body.email);
		});
	
	};
	
	
	sendEmailVerification = function(userEmail){
		
		res.send('You are successfully registred!');
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
		isUserExists(function(yes){
			if (!yes) { createNewUserl();
			} else { res.send('this email already exists'); }
		});
		break;
	
		case 'formLogin': 
		isUserExists(function(yes){
			if (yes) { loginUser();
			} else { res.send('email isnt registered'); }
		});
		break;

		case 'formReset': 
		isUserExists(function(yes){
			if (yes) { resetPassw() 
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

