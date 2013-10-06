module.exports = function(req, res) {
	
	
	var create, getRandom, updateLifeCycle, getLifeCycle, bucket = 'mdown',
	markdown=require('markdown').markdown, s3, sdk = require('aws-sdk');

	s3 = new sdk.S3({ 
		accessKeyId : 'AKIAI5KY54XEDOMGQSCQ', 
		secretAccessKey : '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',
		s3: '2006-03-01'
	});

	create = function() {
		
		var article, key;

		key = getRandom();
		article = req.body.markdown ? req.body.markdown : 'empty';
		
		s3.client.putObject({
			Bucket : bucket,
			Key : key,
			Body : article,
			StorageClass : 'REDUCED_REDUNDANCY',
			ServerSideEncryption : 'AES256',
			ContentType : 'text/x-markdown',
			Metadata : {
				'email' : 'none',
				'public' : 'true',
			}
		}, function(err, data){
			if (err) throw err;
			getLifeCycle(key);
		});
		
	};	
	
	
	getLifeCycle = function(key) {
		
		s3.client.getBucketLifecycle({
			Bucket : bucket
		}, function(err, data){
			if (err) throw err;
			updateLifeCycle(data, key);
		});
		
	}
	
	
	updateLifeCycle = function(data, key) {
		
		var expires, newRules=[];
		
		expires = req.body.expiration;
		switch(expires) {
			case 'day' : expires = 1; break;
			case 'week' : expires = 7; break;
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
			Bucket : bucket,
			LifecycleConfiguration : {
				Rules : newRules
			}
		}, function(err, data){
			if (err) throw err;
			res.redirect('/preview;'+key);
		});
		
	}
	
	
	unlink = function(){
		
		var date, random;
		
		module = require('url').parse(req.url);
		module = module.pathname.split(';')[2];
		
		s3.client.deleteObject({
			Bucket : bucket,
			Key : module
		}, function(err, data){
			if (err) throw err;
			res.redirect('/');
		});
		
	};	
	
	
	getRandom = function(){
		
		var date, random;
				
		date = new Date().getTime();
		random = Math.floor((Math.random()*800)+100);
		
		random = date + random;
		random = random.toString(36);
		
		return random;
		
	};	


	// get from URL module
	module = require('url').parse(req.url);
	module = module.pathname.split(';')[1];
		
	// routing of URL 
	switch(module) {
		
		case 'create': 
		create();
		break;
		
		case 'unlink': 
		unlink();
		break;
		
		default:
		res.redirect('/');
		break;
		
	};
	
	
};
