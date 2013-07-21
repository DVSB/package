// Upload one file

	exports.Upload = function(file) {

		s3.client.putObject({
			Bucket : settings.amazon.bucket,
			Key : settings.user.id + '/' + file.name,
			Body : fs.readFileSync(file.path)
		}, function(err, data) {
			if (err) { console.log(err); } else { 
				fs.unlink(file.path);
			}
			
		});

	};