
	"use strict";
	var amazon = {};
	
	// Login into Amazon Console
	amazon.CredentialsS3 = function() {
		
		var awssum = require('awssum');
		var amazon = awssum.load('amazon/amazon');
		var S3 = awssum.load('amazon/s3').S3;
	
	
		// Credentials
		var s3 = new S3({
			'accessKeyId' : 'AKIAJQTLD2TZ2VZ4SVHA',
			'secretAccessKey' : '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',
			'region' : amazon.US_EAST_1
		});
				
		return s3;
		
	};
	
	// Read Javascript Object
	amazon.GetObject = function (path, callback) {
		
		var s3 = amazon.CredentialsS3();
				
		var options = {
			BucketName : 'fc9cca91802c2f3756a13a85b810e63f',
			ObjectName : path,
			ResponseContentType : 'application/json'
		};
		
		s3.GetObject(options, function(err, data) {			
			//console.log(JSON.parse(data.Body.toString()));
			callback(data.Body);
			return JSON.parse(data.Body);
		});
	
	};
	
	
	amazon.GetObject('hello.json', function(file){
			
		var obj = JSON.stringify(eval('('+file+')'));
		obj = JSON.parse(obj);
		
		console.log(obj.total);
		
	});
	
	
	
	
	

	
	
	