

	exports.ListObjects = function(s3, settings, callback) {

		var params = {
			Bucket : settings.amazon.bucket
		};
		
		s3.client.listObjects(params, function(err, data){
			if (err) { console.log(err); }
			callback(data.Contents);
		});
		
	}


	exports.UnlinkObject = function(s3, settings, item, callback) {

		var params = {
			Bucket : settings.amazon.bucket,
			Key : item
		};
		
		s3.client.deleteObject(params, function(err){
			if (err) { console.log(err); }
			callback();
		});

	}
