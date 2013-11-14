module.exports = function(req, res) {


	var s3 = require('../../api/s3')();
	
	
	var downloadList = function(){
		
		var mdownapi = require('../../api/mdownapi')();
		var publicUserId = req.signedCookies.publickey;
		
		mdownapi.getJson(publicUserId, '/all/blogs', function(data){
			updateAndUploadConfig(data);
		});
		
	};
	

	res.render('privates/create.html');
	
	
};
