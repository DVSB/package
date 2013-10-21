module.exports = function(req, res) {
	
	
	var preview, getAndRenderBlog, renderMDtoHTML,  
	s3 = require('./_api')().s3;
	

	preview = function(file) {
		
		var cookies;
		
		cookies = req.signedCookies;
		file = cookies.userid+'/articles/'+file;

		s3.isObjectExists({
			key : file
		}, function(isExists){
			if (isExists) { getAndRenderBlog(file)
			} else { res.send('file does not exists!') }
		})
		
	};	
	
	
	getAndRenderBlog = function(blogPath){
		
		s3.getObject({
			key : blogPath
		}, function(data){
			fileContent = data.Body + '';
			renderMDtoHTML(fileContent);
		});
		
	};
	
	
	renderMDtoHTML = function(mdContent){
	
		var markdown = require('markdown').markdown;
	
		res.render('private-view.html', { 
			markdown : markdown.toHTML(mdContent),
			key : 'adsadsads'
		});
		
	}
	
	
	module = require('url').parse(req.url);
	module = module.pathname.split('/')[3];
	preview(module);
	
};
