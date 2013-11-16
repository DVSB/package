module.exports = function(req, res) {	
	

	var newBlogId = require('../../api/randomplus')()();
	
	
	var getArticlesList = function(){
		
		var mdownapi = require('../../api/mdownapi')();
		var publicUserId = req.signedCookies.publickey;
		
		mdownapi.getJson(publicUserId, '/all/blogs', function(data){
			uploadNewBlogs1000(data);
			uploadNewBlog(data);
		});

	};
	
	
	var uploadNewBlogs1000 = function(json, newArticleId){
		
		var publicUserId = req.signedCookies.publickey;
		var s3 = require('../../api/s3')();
		
		json.unshift(newBlogId);
				
 		s3.putObject({
 			Key : publicUserId+'/all/blogs',
 			Body : JSON.stringify(json),
			Bucket : 'api.mdown.co'
 		}, function(){
 			onEndCallback();
 		});
		
	};


	var uploadNewBlog = function(articles){
		
		var s3 = require('../../api/s3')();
		var publicUserId = req.signedCookies.publickey;

		var newArticle = {
			'blogid': newBlogId,
			'markdown': req.body.markdown,
			'tags': req.body.tags
		};
		
 		s3.putObject({
 			Key : publicUserId+'/blog/'+newBlogId,
 			Body : JSON.stringify(newArticle),
			Bucket : 'api.mdown.co'
 		}, function(){
 			onEndCallback();
 		});
			
	};
	
	
	var i=0;
	var onEndCallback = function(){
		i++;
		if(i===2) res.redirect('/-/')
	}


	getArticlesList();


};