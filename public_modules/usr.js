module.exports = function(req, res) {
	
	
	// this file care about login, registration, forgot and verify
	// user type password and if exists, is logged, if not is checked
	// if is verified and if it's correct password, if now, is redirected
	// to verify message or forgotten passsword message
	
	
	var checkIfExists, saveNewUserAndSendEmail, checkUserStatus, createCookies,
	sendEmailVerification, verifyEmail, module, _api = require('./_api')(), s3 = _api.s3,
	fingerprint = _api.fingerprint, enigma = _api.enigma;

	
	checkIfExists = function(callback) {
						
		// if empty response without email
		if (req.body.email==='' || req.body.password==='' || Object.keys(req.body).length===0) { 
			res.redirect('/usr/'); return; } 
				
		s3.isObjectExists({
			key : fingerprint(req.body.email)+'/_config.json'
		}, callback);
		
	};
	
	
	saveNewUserAndSendEmail = function(){
				
		s3.putObject({
			key : fingerprint(req.body.email)+'/_config.json',
			body : JSON.stringify({ 
				password : fingerprint(req.body.password),
				isVerified : false
			}),
		}, function(data){
			sendEmailVerification(req.body.email);
		});
	
	};
	
	
	checkUserStatus = function(){
		
		var arePassEqual, isVerified, checkStatus;
		
		arePassEqual = function(user){
			return (user.password===fingerprint(req.body.password));
		}
		
		isVerified = function(user){
			return (user.isVerified===true);
		}
		
		checkStatus = function(data){
			data = JSON.parse(data.Body+'');
			if (arePassEqual(data)&&isVerified(data)) { createCookies() 
			} else { res.send('not equal pass or user not verified'); }
		}
		
		s3.getObject({
			key : fingerprint(req.body.email)+'/_config.json'
		}, checkStatus);
		
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
		
		res.redirect('/');
		
	};
	
	
	sendEmailVerification = function(userEmail){
		
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
			to: 'masdlmdasklm@ondrek.com', // TODO:userEmail
			subject: 'Verify your mdown email',
			text: text,
			html: html
		}, function(err, data) {
			if (err){ console.log(err);
		    } else { console.log("Message sent: " + data.message); }
			res.redirect('/');
		});
	
	};
	
	
	verifyEmail = function(){
		
		var userFingerprint, getConfigOnS3, updateConfigOnS3;
		
		userFingerprint = require('url').parse(req.url);
		if (!userFingerprint.search) { res.redirect('/usr/'); return; }; 
		userFingerprint = userFingerprint.search.substring(1);
				
		getConfigOnS3 = function(){
			s3.getObject({
				key : userFingerprint+'/_config.json'
			}, function(data){
				data = JSON.parse(data.Body+'');
				data.isVerified = true;
				data = JSON.stringify(data);
				updateConfigOnS3(data);
			});
		}
		
		updateConfigOnS3 = function(data){
			s3.putObject({
				key : userFingerprint+'/_config.json',
				body : data
			}, function(data){
				res.redirect('/usr/');
			});
		}
		
		s3.isObjectExists({
			key : userFingerprint+'/_config.json'
		}, function(isExists){
			if (isExists) { getConfigOnS3();
			} else { res.redirect('./'); }
		});
	
	};
	
		
	// this is browse module, this module use two parts of url, first
	// is module and second is search /usr/verify?mkldmkasmk, in switch
	// is browsed module and search can be send inside

	module = require('url').parse(req.url).path.split('/')[2].split('?')[0];
	module = (module==='') ? null : module;

	switch(module) {
	
		case 'check': 
		checkIfExists(function(isExists){
			if (isExists) { checkUserStatus()
			} else { saveNewUserAndSendEmail() }
		});
		break;
	
		case 'verify': 
		verifyEmail();
		break;
	
		default:
		res.render('usr.html');
		break;
	
	};
	
};

