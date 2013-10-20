module.exports = function(req, res) {
	
	var signup, saveNewUser, checkUser, checkPassAndLogin, login,
	s3 = require('./_api')().s3, 
	cookies = require('./_api')().cookies,
	fingerprint = require('./_api')().fingerprint,
	enigma = require('./_api')().enigma;	

	
	checkIfExist = function() {
						
		// if empty response without email
		if (req.body.email==='' || req.body.password==='' || Object.keys(req.body).length===0) { 
			res.redirect('/usr/'); return; }
	
		s3.isUserExists({
			key : fingerprint.getPrivate(req.body.email)
		}, function(answer){
			if (answer) { checkUser()
			} else {	saveNewUser() }
		});
		
	};
	
	
	saveNewUser = function(){
				
		s3.putUser({
			key : fingerprint.getPrivate(req.body.email),
			body : JSON.stringify({ password : fingerprint.getPrivate(req.body.password) }),
		}, function(data){
			res.redirect('/usr/');
		});
		
	};
	
	
	checkUser = function(){
		
		var arePassEqual;
		
		arePassEqual = function(user){
			return (user.password===fingerprint.getPrivate(req.body.password));
		}
		
		s3.getUser({
			key : fingerprint.getPrivate(req.body.email)
		}, function(data){
			var userDetails = data.Body+'';
			userDetails = JSON.parse(userDetails);
			if (arePassEqual(userDetails)) { login() 
			} else { res.send('sorry, passwords are not equal'); }
		});
		
	};


	login = function(){
		
		var publicUserHash, enigmaUserHash;
		
		publicUserHash = fingerprint.getPublic(req.body.email);
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
		
	}
	

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

