module.exports = function(req, res) {
	
	
	var checkIfExist, saveNewUser, checkUser, login, sendVerification,
	_api = require('./_api')(), s3 = _api.s3, cookies = _api.cookies,
	fingerprint = _api.fingerprint, enigma = _api.enigma;	

	
	checkIfExist = function() {
						
		// if empty response without email
		if (req.body.email==='' || req.body.password==='' || Object.keys(req.body).length===0) { 
			res.redirect('/usr/'); return; }
				
		s3.isObjectExists({
			key : fingerprint(req.body.email)+'/_config.json'
		}, function(isExists){
			if (isExists) { checkUser()
			} else { saveNewUser() }
		});
		
	};
	
	
	saveNewUser = function(){
				
		s3.putObject({
			key : fingerprint(req.body.email)+'/_config.json',
			body : JSON.stringify({ 
				password : fingerprint(req.body.password),
				isVerified : false
			}),
		}, function(data){
			sendVerification(req.body.email);
		});
	
	};
	
	
	checkUser = function(){
		
		var arePassEqual;
		
		arePassEqual = function(user){
			return (user.password===fingerprint(req.body.password));
		}
		
		s3.getObject({
			key : fingerprint(req.body.email)+'/_config.json'
		}, function(data){
			arePassEqual = arePassEqual(JSON.parse(data.Body+''));
			if (arePassEqual) { 
			login() } else { res.send('passwrds not equal'); }
		});
		
	};


	login = function(){
		
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
	
	
	sendVerification = function(userEmail){
		
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
		
		console.log('i am before');
		
		smtp.sendMail({
			from: 'mdown <support@mdown.co>',
			to: 'samuel@ondrek.com', // TODO:userEmail
			subject: 'Verify your mdown email',
			text: text,
			html: html
		}, function(err, data) {
			
			// if (err) throw err;
		    
			if (err){ console.log(error);
		    } else { console.log("Message sent: " + data.message); }
			
			//smtp.close();
			
			res.redirect('/');
		});
		
		console.log('i am after');
				
	};
	
	
	module = require('url').parse(req.url);
	module = module.pathname.split('/')[2];	
	
	// routing of URL 
	switch(module) {
		
		case 'signup': 
		checkIfExist();
		break;
		
		default:
		res.render('usr.html');
		break;
		
	};
	
	
};

