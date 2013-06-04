// Upload one file

	exports.Upload = function(file) {

		s3.client.putObject({
			Bucket : settings.amazon.bucket,
			Key : settings.user.userId + '/' + file.name,
			Body : fs.readFileSync(file.path)
		}, function(err, data) {
			if (err) { console.log(err); } else { 
				fs.unlink(file.path);
			}
			
		});

	};