module.exports = function(req, res) {
	
	
	var getOriginalBlog = function(){
		
		var mdownapi = require('../../api/mdownapi')();
		var publicUserId = req.signedCookies.publickey;
		
		mdownapi.getJson(publicUserId, '/blogs/full.json', function(data){
			uploadNewBlogs1000(data);
			uploadNewBlog(data);
		});

	};
	
	
	var uploadNewBlogs1000 = function(json, newArticleId){
		
		var publicUserId = req.signedCookies.publickey;
		var s3 = require('../../api/s3')();
		
		json.unshift({
			'blogid': newBlogId,
			'tags': { 'title':req.body.title, 'published':req.body.published, 'author':req.body.author }
		});
				
 		s3.putObject({
 			Key : publicUserId+'/blogs/full.json',
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
			'tags': { 'title':req.body.title, 'published':req.body.published, 'author':req.body.author }
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


	getOriginalBlog();
	updateBlogList();


};








	module.exports = function(req, res) {


		// My AWS s3 REST API implementation
		var s3 = require('../../api/s3');

		// Library for requests
		var getJson = require('../../api/cors').json();
	
	
		var postOldThisBlogPost = function(){

			var useridFromForm = res.body.userid;
			var blogID = res.body.blogid;
			var newBlogFromForm = res.body.markdown;

			s3.putObject({
	 			Key : useridFromForm+'/blogs/'+blogID+'-latest.md',
	 			Body : JSON.stringify(newBlogFromForm),
				Bucket : 'myS3bucket'
	 		}, function(){
	 			onEndCallback();
	 		});

		};


		var getThisBlogPost = function(articles){

			var blogID = res.body.blogid;
			var pathOfJson = 'api.ondrek.me/blog/'+blogid+'.json';

			getJson(pathOfJson, function(){
				onEndCallback();
			});
				
		};


		var getListOfAllBlogs = function(articles){

			var pathOfJson = 'api.ondrek.me/blogs/all.json';
			
			getJson(pathOfJson, function(){
				onEndCallback();
			});
				
		};


		var getBlogHistory = function(articles){
			
			var latest = req.body.latestBlogId;
			var pathOfJson = 'api.ondrek.me/blog/history-'+latest+'.json';
			
			getJson(pathOfJson, function(){
				onEndCallback();
			});
				
		};
		
		
		var i=0;
		var onEndCallback = function(){
			i++;
			if (i===4) res.render('blogs.html');
		}


		// old version of blogpost shoud be in history
		// newer version should be on s3 with name -latest.
		postOldThisBlogPost();
		getThisBlogPost();
		getListOfAllBlogs();
		getBlogHistory();

	};




