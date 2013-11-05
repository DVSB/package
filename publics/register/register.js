module.exports = function(req, res) {
	
	
	var fingerprint = require('../../api/fingerprint')().get;

		
	var checkIfExists = function(){
		
		var mdowninterface = require('../../api/mdowninterface')();
		var userPrivateKey = fingerprint(req.body.email);
				
		mdowninterface.getUser(userPrivateKey, function(data){
			if(data===404) { getEmptyTemplate(data);
			} else { res.redirect('/errors/e204'); }
		});
	
	};
	
	
	var getEmptyTemplate = function(userdetails){
		
		var randomplus = require('../../api/randomplus')();
		var s3 = require('../../api/s3')();
		
		var emptyUser = {
			'details' : { 'password' : fingerprint(req.body.password), 'isVerified' : false, 'email' : req.body.email },
			'publicKey' : randomplus(),
			'modules' : ['published','author']
		};
		
		s3.putObject({
			Key : fingerprint(req.body.email)+'/user.json',
			Body : JSON.stringify(emptyUser),
			Bucket : 'interface.mdown.co'
		}, function(){
			onEndCallback();
		});
	
	};
	
	
	var sendVerificationEmail = function(){
		
		var email = require('../../api/email')();
		
		email.verifyAccount(req.body.email, fingerprint(req.body.email), function(){
			onEndCallback();
		});

	};
	
	
	var i=0;
	var onEndCallback = function(){
		i++;
		if(i===2) res.redirect('/errors/i200');
	};
	
	checkIfExists();
	sendVerificationEmail();
	
};

