	var underscore = require('underscore');
	underscore.mixin(require('underscore.string').exports()); 'use strict';
	
	var AWS = require('aws-sdk');
	
	AWS.config.update({
		accessKeyId : 'AKIAIOUHQOMOBQZP7RAQ',
		secretAccessKey : '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',
		region : 'us-east-1'
	});
	
	var s3 = new AWS.S3();
	
	var options = {
		Bucket : 'fc9cca91802c2f3756a13a85b810e63f'
	};
	
	// Workflow:
	// Send form via POST and save file to the /tmp
	// Load file from the /tmp and save to the Amazon
	// Remove file from the /tmp
	
	exports.Init = function(app, req, res) {
	
		// Tab Upload
		if (req.body.svc === '0d47a0d59d4675d7b0d0561c9a6c4d04') {
	
			ReadFileFromTmpAndUpload(req, res, function() {
				UnlinkTmpFile(req, res);
			});
	
		}
	
		getListItems(function(objects) {
			
			res.render(__dirname + '/_view.html', {
				hello : objects,
			});
			
		});
	
	};
	
	// Get list of all files in bucket
	function getListItems(callback) {
 
		//options.Prefix = 'google.com.S3FOLDER/';
		//options.Delimiter = '.S3FILE';
			
		// Return array S3 files
		s3.client.listObjects(options, function(err, data) {
	
			if (err) {
				console.log(err);
				return;
			}
			
			var filteredKeys = [];
	
			// Remove useless content from array which goes to callback
			for (var i = 0; i < data.Contents.length; i++) {
				
				console.log(data.Contents[i].Key);
				filteredKeys[i] = data.Contents[i].Key;
				
			}
		
			callback(filteredKeys);
	
		});
	
	}
	
	// Upload Data
	function ReadFileFromTmpAndUpload(req, res, callback) {
	
		var fs = require('fs');
	
		var awssum = require('awssum');
		var amazon = awssum.load('amazon/amazon');
		var S3 = awssum.load('amazon/s3').S3;
	
		// Credentials
		var s3 = new S3({
			'accessKeyId' : 'AKIAJQTLD2TZ2VZ4SVHA',
			'secretAccessKey' : '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',
			'region' : amazon.US_EAST_1
		});
	
		// In REQ.FILES is metadata about uploaded file in TMP
		var options = {
			BucketName : 'fc9cca91802c2f3756a13a85b810e63f',
			ObjectName : req.files.myfile.name,
			ContentType : req.files.myfile.type,
			ContentLength : req.files.myfile.size,
			Body : fs.createReadStream(req.files.myfile.path)
		};
	
		// Put to Amazon
		s3.PutObject(options, function(err, data) {
			callback();
		});
	
	}
	
	// Remove file from the /tmp
	function UnlinkTmpFile(req) {
	
		var fs = require('fs');
		fs.unlink(req.files.myfile.path);
	
	}
	
