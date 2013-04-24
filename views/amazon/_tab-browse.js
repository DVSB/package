

	var fs = require('fs');
	var settings = JSON.parse(fs.readFileSync('settings.json'));


	var AWS = require('aws-sdk');
	AWS.config.update({
		accessKeyId : settings.amazon.id,
		secretAccessKey : settings.amazon.key,
		region : settings.amazon.region
	});
	var s3 = new AWS.S3();


	exports.ListObjects = function(callback) {

		var params = {
			Bucket : settings.amazon.bucket
		};
		
		s3.client.listObjects(params, function(err, data){
			if (err) { console.log(err); }
			callback(data.Contents);
		});
		
	}


	exports.Unlink = function(item) {

		var params = {
			Bucket : settings.amazon.bucket,
			Key : item
		};
		
		s3.client.deleteObject(params, function(err){
			if (err) { console.log(err); }
		});

	}
