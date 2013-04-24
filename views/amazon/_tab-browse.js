
	var fs = require('fs');
	var rootConf = JSON.parse(fs.readFileSync('configuration.json'));

	var AWS = require('aws-sdk');
	AWS.config.update({
		accessKeyId : rootConf.Amazon.Credentials.AccessID,
		secretAccessKey : rootConf.Amazon.Credentials.AccessKey,
		region : rootConf.Amazon.Buckets.Region
	});
	var s3 = new AWS.S3();


	exports.ListObjects = function(callback) {

		var params = {
			Bucket : rootConf.Amazon.Buckets.StorageBucket
		};
		
		s3.client.listObjects(params, function(err, data){
			if (err) { console.log(err); }
			callback(data.Contents);
		});
		
	}

	exports.Unlink = function(item) {

		var params = {
			Bucket : rootConf.Amazon.Buckets.StorageBucket,
			Key : item
		};
		
		s3.client.deleteObject(params, function(err){
			if (err) { console.log(err); }
		});

	}









