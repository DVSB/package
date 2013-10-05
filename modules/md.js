module.exports = function(req, res) {
	
	
	var render, create, getRandom, updateLifeCycle,
	markdown=require('markdown').markdown;


	create = function() {
		
		var s3, article, key,
		sdk = require('aws-sdk');

		s3 = new sdk.S3({ 
			accessKeyId : 'AKIAI5KY54XEDOMGQSCQ', 
			secretAccessKey : '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',
			s3: '2006-03-01'
		});

		key = getRandom();
		article = req.body.markdown ? req.body.markdown : 'empty';
		
		s3.client.putObject({
			Bucket : 'd41d8cd98f00',
			Key : key,
			Body : article,
			StorageClass : 'REDUCED_REDUNDANCY',
			ServerSideEncryption : 'AES256',
			ContentType : 'text/x-markdown'
		}, function(err, data){
			if (err) throw err;
			getLifeCycle(key);
		});
		
	};	
	
	
	getLifeCycle = function(key) {
		
		var s3, sdk = require('aws-sdk');
		
		s3 = new sdk.S3({ 
			accessKeyId : 'AKIAI5KY54XEDOMGQSCQ', 
			secretAccessKey : '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',
			s3: '2006-03-01'
		});
		
		s3.client.getBucketLifecycle({
			Bucket : 'd41d8cd98f00'
		}, function(err, data){
			if (err) throw err;
			updateLifeCycle(data, key);
		});
		
	}
	
	
	updateLifeCycle = function(data, key) {
		
		var s3, expires, newRules=[],
		sdk = require('aws-sdk');
		
		s3 = new sdk.S3({ 
			accessKeyId : 'AKIAI5KY54XEDOMGQSCQ', 
			secretAccessKey : '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',
			s3: '2006-03-01'
		});
		
		expires = req.body.expiration;
		switch(expires) {
			case 'day' : expires = 1; break;
			case 'month' : expires = 31; break;
			case 'year' : expires = 365; break;
		};
			
		newRules = data.Rules;
		newRules.push({
			ID : key,
			Prefix : key,
			Expiration : { Days : expires },
			Status : 'Enabled'
		});
		
		s3.client.putBucketLifecycle({
			Bucket : 'd41d8cd98f00',
			LifecycleConfiguration : {
				Rules : newRules
			}
		}, function(err, data){
			if (err) throw err;
			res.redirect('/');
		});
		
	}
	
	
	
	
	getRandom = function(){
		
		var date, random;
				
		date = new Date().getTime();
		date = date.toString(36) + '';

		random = Math.floor((Math.random()*800)+100);
		random = random.toString(36) + '';
		
		return date + random;
		
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
