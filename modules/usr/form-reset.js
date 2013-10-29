module.exports = function(req, res) {


	resetPassw = function(){
		
		var
		publicUserHash,
		privateKey='-';
		
		publicUserHash = fingerprint(req.body.resetEmail);
		privateKey += fingerprint(publicUserHash).substring(0, 30);
		
		api.email.resetPassword(req.body.resetEmail, publicUserHash+privateKey, function(){
			res.redirect('/errors/i202');
		});
		
	};
	
	
	isUserExists(req.body.resetEmail, function(yes){
		if (yes) { resetPassw();
		} else { res.send('sorry, this user doesnt exists'); }
	});
	
	
};

