module.exports = function(req, res) {
	
	var
	loginUser;
	
	
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
		
		createCookies = function(){
				
			var
			publicUserHash = fingerprint(req.body.loginEmail),
			options = { signed: true, httpOnly: true };
	
			res.cookie('islogged', 'true', options);
			res.cookie('userid', publicUserHash, options);
			res.cookie('userhash', cookieSecret(publicUserHash), options);
			res.redirect('/-/');
		
		};

	}; 


	isUserExists(req.body.loginEmail, function(yes){
		if (yes) { loginUser();
		} else { res.redirect('/errors/e203'); }
	});
	
	
};

