module.exports = function(req, res) {
	
	
	var checkIfExist, saveNewUser, checkUser, login, 
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
			res.redirect('/usr/');
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

