module.exports = function(req, res) {
		
	
	var fingerprint = require('../../api/fingerprint')().get;

		
	var checkIfExists = function(){
		
		var mdowninterface = require('../../api/mdowninterface')();
		var userPrivateKey = fingerprint(req.body.email);
						
		mdowninterface.getUser(userPrivateKey, function(data){
			if(data!==404) { verifyEmailKey(data);
			} else { res.redirect('/reset/'); }
		});
	
	};
	
	
	var verifyEmailKey = function(config){
		
		if (config.details.resetPasswordFlag===req.body.key){
			updateConfigFlagAndPassword(config);
		} else { res.redirect('/reset/'); }
		
	}
	
	
	var updateConfigFlagAndPassword = function(config){
		
		var s3 = require('../../api/s3')();
		
		config.details.password = fingerprint(req.body.password);
		delete config.details.resetPasswordFlag;
		
		s3.putObject({
			Key : fingerprint(req.body.email)+'/user.json',
			Body : JSON.stringify(config),
			Bucket : 'interface.mdown.co'
		}, function(){
			res.redirect('/errors/i201');
		});
		
	}
	
	
	
	checkIfExists();
	
	
};