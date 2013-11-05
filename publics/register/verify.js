module.exports = function(req, res) {

	
	var userKey = require('url').parse(req.url).path.split('/')[3];


	var checkIfExists = function(){
		
		var mdowninterface = require('../../api/mdowninterface')();
				
		mdowninterface.getUser(userKey, function(data){
			if(data===404) { res.redirect('/errors/e204'); 
			} else { updateConfig(data); }
		});
	
	};
	
	
	var updateConfig = function(config){
		
		config.details.isVerified = true;
		config = JSON.stringify(config);
		uploadNewConfig(config);
		
	};
	
	
	var uploadNewConfig = function(config){
		
		var s3 = require('../../api/s3')();
		
		s3.putObject({
			Key : userKey+'/user.json',
			Body : config,
			Bucket : 'interface.mdown.co'
		}, function(){
			res.redirect('/errors/i203');
		});
		
	};
	
	
	checkIfExists();
	
	
};

