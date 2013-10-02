module.exports = function(req, res) {
	
	
	var render, create, 
	markdown=require('markdown').markdown;

	


	create = function() {
		
		var s3, title, article, user,
		sdk = require('aws-sdk');

		sdk.config.update({ 
			accessKeyId : 'AKIAI5KY54XEDOMGQSCQ', 
			secretAccessKey : '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' 
		});
		s3 = new sdk.S3();

		user = '022d4fed34c4c251f241';
		article = req.body.markdown ? markdown.toHTML(req.body.markdown) : 'empty';
		title = req.body.date+'-'+req.body.title;
		
		s3.client.putObject({
			Bucket : 'd41d8cd98f00',
			Key : user+'/markdown/'+title,
			Body : article
		}, function(err, data){
			if (err) throw err;
			res.send('done');
		});
		
	};		
	
	
	render = function(){
		
		res.send('hello');
		
	};	


	// get from URL module
	module = require('url').parse(req.url);
	module = module.pathname.split(';')[1];
		
	// routing of URL 
	switch(module) {
		
		case 'create': 
		create();
		break;
		
		case 'verify': 
		//verifyEmail();
		break;
		
		default:
		render();
		break;
		
	};
	
	
};
