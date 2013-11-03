module.exports = function(req, res) {


	var _s3 = require('../../api/s3')(),
	_fingerprint = require('../../api/fingerprint')().get,
	_email = require('../../api/email')(),
	formEmail = req.body.email;
	
	
	sentResetEmail = function(){
		
		var publicUserHash = _fingerprint(formEmail),
		privateKey = _fingerprint(publicUserHash).substring(0, 30);
		
	
		console.log('public: ' + publicUserHash);
		console.log('private: ' + privateKey);
		
		_email.resetPassword(formEmail, publicUserHash+privateKey, function(){
			res.redirect('/errors/i202');
		});
		
	};
	
	
	s3.isObjectExists({
		Key : _fingerprint(formEmail)+'/_configuration/user.json'
	}, function(isExists){
		
		if(isExists) { sentResetEmail(); 
		} else { res.redirect('/errors/e203'); }
		
	});
	
	
};

