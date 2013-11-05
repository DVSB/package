module.exports = function(req, res) {


	var fingerprint = require('../../api/fingerprint')().get;
	
	
	var checkIfExists = function(){
		
		var mdowninterface = require('../../api/mdowninterface')();
		var userPrivateKey = fingerprint(req.body.email);
				
		mdowninterface.getUser(userPrivateKey, function(data){
			if(data!==404) { generateResetConfigFlag(data);
			} else { res.redirect('/errors/e203'); }
		});
	
	};
	
	
	var generateResetConfigFlag = function(config){
			
		var userPrivateKey = fingerprint(req.body.email);
		var resetFlag = fingerprint(userPrivateKey);
		
		config.details.resetPasswordFlag = resetFlag;
		config = JSON.stringify(config);
		
		uploadNewConfig(userPrivateKey, config);
		sendResetEmail(resetFlag);
		
	};
	
	
	var uploadNewConfig = function(userPrivateKey, config){
		
		var s3 = require('../../api/s3')();
		
		s3.putObject({
			Key : userPrivateKey+'/user.json',
			Body : config,
			Bucket : 'interface.mdown.co'
		}, function(){
			onEndCallback();
		});
		
	};
	
	
	var sendResetEmail = function(resetFlag){
		
		var email = require('../../api/email')();
		
		email.resetPassword(req.body.email, resetFlag, function(){
			onEndCallback();
		});
		
	};
	
	
	var i=0;
	var onEndCallback = function(){
		i++;
		if(i===2) res.redirect('/errors/i202');
	};
	
	
	checkIfExists();
	
	
};

