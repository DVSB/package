module.exports = function(req, res) {
	
	var _randomplus = require('../../api/randomplus')(),
	_s3 = require('../../api/s3')(),
	_email = require('../../api/email')(),
	_fingerprint = require('../../api/fingerprint')().get,
	formEmail = req.body.email,
	formPass = req.body.password;

	
	if (!formEmail || !formPass || formPass.length<6 || formEmail.length<7) {
		res.redirect('/usr/register');
		return;
	}
	
	
	var getEmptyTemplate = function(){
				
		var
		templateConf = __dirname+'/../../templates/user.json';
		
		_s3.putObject({
			Key : _fingerprint(formEmail)+'/_configuration/articles.json',
			Body : '[]'
		}, function(){});
	
		require('fs').readFile(templateConf, function (err, data) {
			if (err) throw err;
			fillTemplateWithCredentials(data+'');
		});
		
	};
	
	
	var fillTemplateWithCredentials = function(data){
		
		data = JSON.parse(data);
		
		data.details.password = _fingerprint(formPass);
		data.details.email = formEmail;
		data.api.publicKey = _fingerprint(formEmail);
		data.api.privateKey = _randomplus.generate();
		
		saveTemplateToS3(JSON.stringify(data));
		
	};
	
	
	var saveTemplateToS3 = function(data){
					
		var path;
		
		path = _fingerprint(formEmail);
		path += '/_configuration/user.json';
		
		_s3.putObject({
			Key : path,
			Body : data
		}, function(){
			sendVerificationEmail();
		});
		
	};
	
	
	var sendVerificationEmail = function(){
				
		_email.verifyAccount(formEmail, _fingerprint(formEmail), function(){
			res.redirect('/errors/i200');
		});

	};
	
	
	s3.isObjectExists({
		Key : _fingerprint(formEmail)+'/_configuration/user.json'
	}, function(isExists){
				
		if(!isExists) { getEmptyTemplate(); 
		} else { res.redirect('/errors/e204'); }
		
	});
	
	
};

