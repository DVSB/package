module.exports = function(req, res) {
	
	
	// TODO, user can anytime reset his password on this link
	// SOLUTION
	// if reset succesfully reset fill form, add to config frag
	// so when reset password, remove this flag
	
	
	var _randomplus = require('../../api/randomplus')(),
	_s3 = require('../../api/s3')(), publicURLKey, newPassword,
	_fingerprint = require('../../api/fingerprint')().get,
	_email = require('../../api/email')(),	uploadNewConfig, 
	updateConfig, donwloadOldConfig, verifyHash;
	
	
	// url contains publickey+secret
	publicURLKey = require('url').parse(req.url).path.split('/')[2];
	publicURLKey = publicURLKey.split('?')[1];
	
	
	verifyHash = function(){
		
		var privateURLKey, calculateKey;
	
		// last 30 characters is verify string
		privateURLKey = publicURLKey.substr(publicURLKey.length-30, 30);
		publicURLKey = publicURLKey.substr(0, publicURLKey.length-30);
	
		// calculate internal key for verification
		calculateKey = _fingerprint(publicURLKey).substring(0, 30);

		// check if public verification key is really this
		if (calculateKey===privateURLKey){  donwloadOldConfig();
		} else { res.send('sorry, but you cannot reset password'); return; }
		
	};

	
	donwloadOldConfig = function(){
		
		_s3.getObject({
			Key : publicURLKey+'/_configuration/user.json'
		}, function(data){
			data = JSON.parse(data.Body+'');
			updateConfig(data);
		});
		
	};
	
	
	updateConfig = function(config){
		
		var newPassword;
		
		newPassword = _randomplus.generate();
		config.details.password = _fingerprint(newPassword+'');
		config = JSON.stringify(config);
		
		uploadNewConfig(config, newPassword);
		
	};
	
	
	uploadNewConfig = function(config, newPassword){
		
		_s3.putObject({
			Key : publicURLKey+'/_configuration/user.json',
			Body : config
		}, function(){
			sendEmailWithNewPass(config, newPassword);
		});
	
	};
	
	
	sendEmailWithNewPass = function(config, newPassword){
		
		_email.sendNewPass(JSON.parse(config).details.email, newPassword, function(){
			res.redirect('/errors/i201');
		});
	
	};
	
	
	verifyHash();
	
	
};
