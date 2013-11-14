module.exports = function(req, res) {
	
	
	var getBlogList = function(){
		
		var mdownapi = require('../../api/mdownapi')();
		var publicUserId = req.signedCookies.publickey;
		
		mdownapi.getJson(publicUserId, '/all/blogs', function(data){
			editBlogList(data);
		});

	};


	var editBlogList = function(list){

		var updateObject = function(ele){
			ele.tags.title = req.body.title;
			ele.tags.published = req.body.published;
			ele.tags.author = req.body.author;
		};

		list.forEach(function(ele){
			if(ele.blogid===req.body.blogid) updateObject(ele);
		});

		uploadBlogList(list);

	};

	


	var uploadBlogList = function(list){

		var publicUserId = req.signedCookies.publickey;
		var s3 = require('../../api/s3')();
				
 		s3.putObject({
 			Key : publicUserId+'/all/blogs',
 			Body : JSON.stringify(list),
			Bucket : 'api.mdown.co'
 		}, function(){
 			onEndCallback();
 		});

	};
	
	
	var getBlogPost = function(json, newArticleId){
		
		var mdownapi = require('../../api/mdownapi')();
		var publicUserId = req.signedCookies.publickey;
		var blogid = req.body.blogid;
		
		mdownapi.getJson(publicUserId, '/blog/'+blogid, function(data){
			editBlogPost(data);
		});

	};


	var editBlogPost = function(article){

		article.markdown = req.body.markdown;
		article.tags.title = req.body.title;
		article.tags.published = req.body.published;
		article.tags.author = req.body.author;

		uploadBlogPost(article);

	};


	var uploadBlogPost = function(article){

		var publicUserId = req.signedCookies.publickey;
		var s3 = require('../../api/s3')();
		var blogid = req.body.blogid;
				
 		s3.putObject({
 			Key : publicUserId+'/blog/'+blogid,
 			Body : JSON.stringify(article),
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


	getBlogList();
	getBlogPost();


};








	




