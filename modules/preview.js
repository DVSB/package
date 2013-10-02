module.exports = function(req, res) {
	
	
	var preview, save, 
	markdown=require('markdown').markdown,
	string = require('underscore.string');


	preview = function() {
		
		var title, article, slug;
		
		article = req.body.markdown ? markdown.toHTML(req.body.markdown) : 'empty-markdown';
		title = req.body.title ? req.body.title : 'empty-title';
		slug = string.slugify(title);
		
		res.render('preview.html', { param:{
			'title' : title, 
			'article' : article,
			'slug' : slug
		}});
		
	};
	
	
	save = function() {
		
		var s3, title, article,
		sdk = require('aws-sdk');

		sdk.config.update({ 
			accessKeyId : 'AKIAI5KY54XEDOMGQSCQ', 
			secretAccessKey : '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' 
		});
		s3 = new sdk.S3();

		article = req.body.markdown ? markdown.toHTML(req.body.markdown) : 'empty';
		title = req.body.date+'_'+req.body.title;
		
		s3.client.putObject({
			Bucket : 'MarkdownPastebin',
			Key : title,
			Body : article
		}, function(err, data){
			if (err) throw err;
			res.send('done');
		});
		
	};
	

	// get from URL module
	module = require('url').parse(req.url);
	module = module.pathname.split(';')[1];
		
	// routing of URL 
	switch(module) {

		case 'save;': 
		save();
		break;
		
		default:
		preview();
		break;
		
	};
	
	
};
