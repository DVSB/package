module.exports = function(req, res) {
	
	
	var save, preview, getAndRenderBlog, renderMDtoHTML,  
	s3 = require('./_api')().s3;
	

	preview = function(file) {
		
		// with list all objects but with prefix which is uniq
		// name of file, result is only one key always
		s3.listObjects({
			prefix : file
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
	
	
	// get from URL module
	module = require('url').parse(req.url);
	module = module.pathname.split('/')[1].substring(1);
	preview(module);
	
};
