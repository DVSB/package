
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
	
	// Upload Object
	amazon.PutObject = function (obj, path) {
		
		if (path==undefined) {
			path = ''; 
			console.log('path neprisla!');
		} else {
			console.log('path prisla: ' + path);
		}
	
		var s3 = amazon.CredentialsS3();
	
			var options = {
			BucketName : 'fc9cca91802c2f3756a13a85b810e63f',
			ObjectName : path,
			ContentLength : Buffer.byteLength(obj),
			Body : obj
		};
		
		console.log('here: ' + options.ObjectName);
		
		s3.PutObject(options, function(err, data) {
			console.log('err: ' + err);
		});
	
	}
	
	
	
	var objekt = {
		"string1" : "1",
		"string2" : "2"
	};
	
	var folder = 'test.json';
	
	amazon.PutObject(JSON.stringify(objekt), folder);
	
	