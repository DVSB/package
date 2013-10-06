module.exports = function(req, res) {
	
	
	var save, preview, s3, sdk = require('aws-sdk');
	
	s3 = new sdk.S3({ 
		accessKeyId : 'AKIAI5KY54XEDOMGQSCQ', 
		secretAccessKey : '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',
		s3: '2006-03-01'
	});

	preview = function(file) {
		
		var article, key;

		s3.client.getObject({
			Bucket : 'd41d8cd98f00',
			Key : file
		}, function(err, data){
			if (err) throw err;
			render(data);
		});
		
	};	
	
	render = function(data) {
		
		console.log(data);
		
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
		preview(module);
		break;
		
	};
	
	
};
