

	var fs = require('fs');
	var settings = JSON.parse(fs.readFileSync('settings.json'));


	var AWS = require('aws-sdk');
	AWS.config.update({
		accessKeyId : settings.amazon.id,
		secretAccessKey : settings.amazon.key,
		region : settings.amazon.region
	});
	var s3 = new AWS.S3();


	exports.Upload = function(req, callback) {

		var params = {
			Bucket : settings.amazon.bucket,
			Key : settings.user.userId + '/' + req.files.myfile.name,
			Body : fs.readFileSync(req.files.myfile.path)
		};
		
		s3.client.putObject(params, function(err) { 
			
			if (err) { console.log(err); }

			// /temp
			fs.unlink(req.files.myfile.path);

		});
		
	}
