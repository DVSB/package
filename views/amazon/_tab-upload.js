

	exports.Upload = function(s3, settings, fs, req) {	
		
		for (var i=0; i<=req.files.myfile.length-1; i++) {
			
			var params = {
				Bucket : settings.amazon.bucket,
				Key : settings.user.userId + '/' + req.files.myfile[i].name,
				Body : fs.readFileSync(req.files.myfile[i].path)
			};
			
			s3.client.putObject(params, function(err, data) { 
				if (err) { console.log(err); }
				fs.unlink(req.files.myfile[i].path);
			});
		
		}
		
	};
