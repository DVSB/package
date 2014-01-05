module.exports = function(req, res) {


	var s3 = require('../../api/s3')();

	
	var downloadList = function(){
		
		var mdownapi = require('../../api/mdownapi')();
		var publicUserId = req.signedCookies.publickey;
		
		mdownapi.getJson(publicUserId, '/tags', function(data){
			renderScreen(data);
		});
		
	};


	var renderScreen = function(tags){
	
		res.render('create.html', {
			tags : tags 
		});
		
	};


	downloadList();

	
};
