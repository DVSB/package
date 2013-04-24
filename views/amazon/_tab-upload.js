
	var fs = require('fs');
	var rootConf = JSON.parse(fs.readFileSync('configuration.json'));


	// Amazon SDK API setup
	var AWS = require('aws-sdk');
	AWS.config.update({
		accessKeyId : rootConf.Amazon.Credentials.AccessID,
		secretAccessKey : rootConf.Amazon.Credentials.AccessKey,
		region : rootConf.Amazon.Buckets.Region
	});
	var s3 = new AWS.S3();


	exports.Upload = function(req, callback) {

		var params = {
			Bucket : rootConf.Amazon.Buckets.StorageBucket,
			Key :rootConf.User.ID + '/' + req.files.myfile.name,
			Body : fs.readFileSync(req.files.myfile.path)
		};
		
		s3.client.putObject(params, function(err) { 
			
			if (err) { console.log(err); }

			// /temp
			fs.unlink(req.files.myfile.path);

		});
		
	}
