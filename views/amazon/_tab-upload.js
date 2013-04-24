

	exports.Upload = function(s3, settings, fs, req, callback) {

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
