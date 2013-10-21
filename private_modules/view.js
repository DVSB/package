module.exports = function(req, res) {
	
	
	var save, preview, getAndRenderBlog, renderMDtoHTML,  
	s3 = require('./_api')().s3, cookies = req.signedCookies;
	

	preview = function(file) {
		
		console.log(cookies);
		return false;
		
		// with list all objects but with prefix which is uniq
		// name of file, result is only one key always
		s3.listObjects({
			prefix : cookies.userid+'/articles/'+file
		},function(data){
			var realName = data.Contents[0].Key;
			getAndRenderBlog(realName);
		});
		
	};	
	
	
	getAndRenderBlog = function(realFile){
		
		// get object from s3, content is markdown file which
		// we need parse before place to HTML
		s3.getObject({
			key : realFile
		}, function(data){
			fileContent = data.Body + '';
			renderMDtoHTML(fileContent);
		});
		
	};
	
	
	renderMDtoHTML = function(mdContent){
	
		var markdown = require('markdown').markdown;
		
		res.render('private-preview.html', { 
			markdown : markdown.toHTML(mdContent),
			key : 'adsadsads'
		});
		
	}
	
	
	module = require('url').parse(req.url);
	module = module.pathname.split('/')[3];
	preview(module);
	
};
