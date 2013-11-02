module.exports = function(req, res) {
	
	
	var _s3 = require('../api/s3')(), cookies=req.signedCookies, 
	getArticlesList, uploadListAndBlog;

	
	preview = function() {
		
		var articleID; 
		
		articleID = require('url').parse(req.url).path.split('/')[3].split('?')[0];
		articleID = (articleID==='') ? null : articleID;
		
		console.log(cookies.userid+'/blog-module/'+articleID);
	
		_s3.getObject({
			Key : cookies.userid+'/blog-module/'+articleID
		}, function(data){
			data = JSON.parse(data.Body+'');
			renderBlog(data);
		})
		
	};	
	
	
	renderBlog = function(blogDetails){
		
		blogDetails.html = 
			require('markdown').markdown.toHTML(blogDetails.markdown);
			
		res.render('view.html', { 
			data : blogDetails
		});
		
	};
	
	
	preview();
	
	
};
