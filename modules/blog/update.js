module.exports = function(req, res) {


	var blogid = req.body.blogid;
	var userId = req.signedCookies.publickey;

		
	
	var getBlogPost = function(json, newArticleId){
		
		var mdownapi = require('../../api/mdownapi')();
		
		mdownapi.getJson(userId, '/blog/'+blogid, function(data){
			editAndUploadBlog(data);
		});

	};


	var editAndUploadBlog = function(article){

		var s3 = require('../../api/s3')();

		article.markdown = req.body.markdown;
		article.tags = req.body.tags;
				
 		s3.putObject({
 			Key : userId+'/blog/'+blogid,
 			Body : JSON.stringify(article),
			Bucket : 'api.mdown.co'
 		}, function(){
 			res.redirect('/-/');
 		});

	};


	getBlogPost();


};








	




