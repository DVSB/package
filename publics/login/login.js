module.exports = function(req, res) {
	
	
	if (!req.body.email || !req.body.password || req.body.password.length<6 || req.body.email.length<7) {
		res.redirect('/login/');
		return;
	}
	
	
	var fingerprint = require('../../api/fingerprint')().get;

	
	var checkIfThisUserExists = function(){
		
		var mdowninterface = require('../../api/mdowninterface')();
		var userPrivateKey = fingerprint(req.body.email);
				
		mdowninterface.getUser(userPrivateKey, function(data){
			if (data===404) { res.redirect('/errors/e203');
			} else { checkIfPasswordsEqual(data); }
		});
		
	};
	
	
	var checkIfPasswordsEqual = function(userData){
		
		var userSavedPassword = userData.details.password;
		var userEnteredPass = fingerprint(req.body.password);
					
		if (userEnteredPass===userSavedPassword){
		checkIfVerified(userData); } else { res.redirect('/errors/e201'); }
		
	};


	var checkIfVerified = function(userData){
		
		var userIsVerified = userData.details.isVerified;
				
		if (userIsVerified===true) { createLoginCookies(userData); 
		} else { res.redirect('/errors/e202'); }
		
	};
	
	
	var createLoginCookies = function(userData){
 
		var options = { signed: true, httpOnly: true };
		res.cookie('islogged', 'true', options);
		res.cookie('fingerprint', fingerprint(userData.publicKey), options);
		res.cookie('publicKey', userData.publicKey, options);

		res.redirect('/-/');
	
	};
	
	
	checkIfThisUserExists();
	
	
};

