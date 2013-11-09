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
		
		var html = require('markdown').markdown.toHTML(blog.markdown);
			
		res.render('privates/preview.html', { 
			title : blog.tags.title, 
			published: blog.tags.published, 
			author : blog.tags.author, 
			html : html
		});
		
	};
	
	
	getThisArticle();
	
	
};
