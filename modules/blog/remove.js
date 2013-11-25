module.exports = function(req, res) {
	
	
	var s3 = require('../../api/s3')();
	var urlArticleId = require('url').parse(req.url).path.split('/')[2].split('?')[0];
	var publicUserId = req.signedCookies.publickey;

	
	var downloadList = function(){
		
		var mdownapi = require('../../api/mdownapi')();
		
		mdownapi.getJson(publicUserId, '/all/blogs', function(data){
			updateAndUploadConfig(data);
		});
		
	};
	
	
	var updateAndUploadConfig = function(data){
		
		data = require('underscore').without(
			data, urlArticleId
		);
		
		s3.putObject({
			Key : publicUserId+'/all/blogs',
			Body : JSON.stringify(data),
			Bucket : 'api.mdown.co'
		}, function(){
			onEndCallback();
		});
		
	};
	
	
	var deleteRealBlog = function(){
				
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
		if(i===2) res.redirect('/');
	};
	

	downloadList();
	deleteRealBlog();
	
	
};

