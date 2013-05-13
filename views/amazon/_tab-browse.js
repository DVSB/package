

	exports.ListObjects = function(s3, settings, callback) {

		var params = {
			Bucket : settings.amazon.bucket
		};
		
		s3.client.listObjects(params, function(err, data){
			if (err) { console.log(err); }
			callback(data.Contents);
		});
		
	}


	exports.UnlinkObject = function(s3, settings, items, callback) {

		var params = {
			Bucket : settings.amazon.bucket,
			Key : items
		};
		
		s3.client.deleteObject(params, function(err){
			if (err) { console.log(err); }
			callback();
		});

	}
