module.exports = function(req, res) {

	var
	_s3 = require('../../api/s3')(),
	_fingerprint = require('../../api/fingerprint')().get,
	formEmail = req.body.email,
	formPass = req.body.password,
	getConfig,
	checkIfPasswordsEqual,
	checkIfUserVefified,
	createCookies;
	
	
	if (!formEmail || !formPass || formPass.length<6 || formEmail.length<7) {
		res.redirect('/usr/login');
		return;
	}
	
	
	getConfig = function(){
		
		s3.getObject({
			Key : _fingerprint(formEmail)+'/_configuration/user.json'
		}, function(data){
			data = JSON.parse(data.Body+'');
			checkIfPasswordsEqual(data);
		});
		
	};
	
	
	checkIfPasswordsEqual = function(data){
		
		if (data.details.password!==_fingerprint(formPass)) {
			/* wrong passwords error */
			res.redirect('/errors/e201');
		} else {	checkIfUserVefified(data); }
		
	};
	
	
	checkIfUserVefified = function(data){
						
		if (data.details.isVerified!==true) {
			/* is not verified */ 
			res.redirect('/errors/e202');
		} else { createCookies(); }
		
	};
	
	
	createCookies = function(){
			
		var
		publicUserHash = _fingerprint(formEmail),
		cookieSecret = _fingerprint(publicUserHash),
		options = { signed: true, httpOnly: true };

		res.cookie('islogged', 'true', options);
		res.cookie('userid', publicUserHash, options);
		res.cookie('userhash', cookieSecret, options);
		res.redirect('/-/');
	
	};
	
	
	s3.isObjectExists({
		Key : _fingerprint(formEmail)+'/_configuration/user.json'
	}, function(isExists){
		
		if(isExists) { getConfig(); 
		} else { res.redirect('/errors/e203'); }
		
	});
	
	
};

