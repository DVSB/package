module.exports = function(req, res) {


	var userKey, _s3 = require('../../api/s3')(), donwloadOldConfig,
	updateConfig, uploadNewConfig;
	
	
	donwloadOldConfig = function(){
		
		_s3.getObject({
			Key : userKey+'/_configuration/user.json'
		}, function(data){
			data = JSON.parse(data.Body+'');
			updateConfig(data);
		});
		
	};
	
	
	updateConfig = function(config){
		
		config.details.isVerified = true;
		config = JSON.stringify(config);
		uploadNewConfig(config);
		
	};
	
	
	uploadNewConfig = function(config){
		
		_s3.putObject({
			Key : userKey+'/_configuration/user.json',
			Body : config
		}, function(){
			res.redirect('/errors/i203');
		});
	
	};
	
	
	userKey = require('url').parse(req.url).path.split('/')[2];
	userKey = userKey.split('?')[1];
	
	
	_s3.isObjectExists({
		Key : userKey+'/_configuration/user.json'
	}, function(isExists){
		if(isExists) { donwloadOldConfig(); 
		} else { res.redirect('/errors/e204'); }
	});
	
};

