module.exports = function(req, res) {
	

	var getThisArticle = function() {

		var mdownapi = require('../../api/mdownapi')();
		var publicUserId = req.signedCookies.publickey;

		var blogId = require('url').parse(req.url).path;
		blogId = blogId.split('/')[3].split('?')[0];
		
		mdownapi.getJson(publicUserId, '/blog/'+blogId, function(data){
			renderBlog(data);
		});
		
	};	
	
	
	var renderBlog = function(blog){
		
		var content = require('markdown').markdown.toHTML(
			blog.markdown);
			
		res.render('preview.html', {
			tags : blog.tags, 
			content : content
		});
		
	};
	
	
	getThisArticle();
	
	
};
