module.exports = function(req, res) {
	
	var
	_randomplus = require('../../api/randomplus')(),
	_s3 = require('../../api/s3')(),
	_email = require('../../api/email')(),
	_fingerprint = require('../../api/fingerprint')().get,
	formEmail = req.body.email,
	formPass = req.body.password,
	createNewUser,
	getTemplate,
	editTemplate,
	saveTemplateToS3;
	
	
	if (!formEmail || !formPass || formPass.length<6 || formEmail.length<7) {
		res.redirect('/usr/register');
		return;
	}
	
	
	getEmptyTemplate = function(){
				
		var
		templateConf = __dirname+'/../../templates/configuration.json';
	
		require('fs').readFile(templateConf, function (err, data) {
			if (err) throw err;
			fillTemplateWithCredentials(data+'');
		});
		
	};
	
	
	fillTemplateWithCredentials = function(data){
		
		data = JSON.parse(data);
		
		data.details.password = _fingerprint(formPass);
		data.api.publicKey = _fingerprint(formEmail);
		data.api.privateKey = _randomplus.generate();
		
		saveTemplateToS3(JSON.stringify(data));
		
	};
	
	
	saveTemplateToS3 = function(data){
					
		var path;
		
		path = _fingerprint(formEmail);
		path += '/user-details/_config.json';
		
		_s3.putObject({
			Key : path,
			Body : data
		}, function(){
			sendVerificationEmail();
		});
		
	};
	
	
	sendVerificationEmail = function(userEmail){
				
		_email.verifyAccount(formEmail, _fingerprint(formEmail), function(){
			res.redirect('/errors/i200');
		});

	};
		
	
	s3.isObjectExists({
		Key : _fingerprint(formEmail)+'/user-details/_config.json'
	}, function(isExists){
				
		if(!isExists) { getEmptyTemplate(); 
		} else { res.redirect('/errors/e204'); }
		
	});
	
	
};

