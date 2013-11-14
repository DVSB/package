module.exports = function(req, res) {
	
	
	var s3 = require('../../api/s3')();
	var urlArticleId = require('url').parse(req.url).path.split('/')[3].split('?')[0];
	
	
	var downloadList = function(){
		
		var mdownapi = require('../../api/mdownapi')();
		var publicUserId = req.signedCookies.publickey;
		
		mdownapi.getJson(publicUserId, '/all/blogs', function(data){
			updateAndUploadConfig(data);
		});
		
	};
	
	
	var updateAndUploadConfig = function(data){
		
		var underscore = require('underscore');
		var matchedKey = underscore.findWhere(data, { 'blogid' : urlArticleId });
		var publicUserId = req.signedCookies.publickey;
				
		data = underscore.without(data, matchedKey);
		data = JSON.stringify(data);
		
		s3.putObject({
			Key : publicUserId+'/all/blogs',
			Body : data,
			Bucket : 'api.mdown.co'
		}, function(){
			onEndCallback();
		});
		
	};
	
	
	var deleteRealBlog = function(){
		
		var publicUserId = req.signedCookies.publickey;
		
		s3.deleteObject({
			Key : publicUserId+'/blog/'+urlArticleId,
			Bucket : 'api.mdown.co'
		}, function(){
			onEndCallback();
		});
		
	};
	
	
	var i=0;
	var onEndCallback = function(){
		i++;
		if(i===2) res.redirect('/-/')
	};
	

	downloadList();
	deleteRealBlog();
	
	
};

